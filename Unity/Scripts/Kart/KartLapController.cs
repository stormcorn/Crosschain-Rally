using System;
using System.Linq;
using Fusion;
using UnityEngine;

public class KartLapController : KartComponent {

    public static event Action<KartLapController> OnRaceCompleted;

    [Networked(OnChanged = nameof(OnLapChangedCallback))]
    public int Lap { get; set; } = 1;

    [Networked, Capacity(5)]
    public NetworkArray<int> LapTicks { get; }

    [Networked]
    public int StartRaceTick { get; set; }

    [Networked] 
    public int EndRaceTick { get; set; }

    [Networked(OnChanged = nameof(CheckpointIndexChanged))] private int CheckpointIndex { get; set; } = -1;

    public event Action<int, int> OnLapChanged;
    public bool HasFinished => EndRaceTick != 0;
    
    private KartController Controller => Kart.Controller;
    private GameUI Hud => Kart.Hud;

    private NetworkRigidbody _nrb;

    private void Awake() {
        _nrb = GetComponent<NetworkRigidbody>();
    }

    public override void Spawned() {
        base.Spawned();

        // lap control is not needed if the gametype does not use laps
        if ( GameManager.Instance.GameType.IsPracticeMode() ) {
            enabled = false;
        } else {
            Lap = 1;
        }
    }

    public override void OnRaceStart() {
        base.OnRaceStart();

        StartRaceTick = Runner.Simulation.Tick;
    }

	public override void OnLapCompleted(int lap, bool isFinish)
	{
		base.OnLapCompleted(lap, isFinish);

        if ( isFinish ) {
            if ( Object.HasInputAuthority ) {
                // finished race
                AudioManager.Play("raceFinishedSFX", AudioManager.MixerTarget.SFX);
                Hud.ShowEndRaceScreen();
            }

            Kart.Controller.RoomUser.HasFinished = true;
            EndRaceTick = Runner.Simulation.Tick;
        } else
		{
			if (Object.HasInputAuthority)
			{
				AudioManager.Play("newLapSFX", AudioManager.MixerTarget.SFX);
			}
		}

		OnRaceCompleted?.Invoke(this);
	}

    public void ResetToCheckpoint() {
        var tgt = CheckpointIndex == -1
            ? GameManager.CurrentTrack.finishLine.transform
            : GameManager.CurrentTrack.checkpoints[CheckpointIndex].transform;

        _nrb.TeleportToPositionRotation(tgt.position, tgt.rotation);

        //Reset Kart, stop moving/drifting/boosting and clear item! / play SFX  
        Controller.ResetState();
    }

    private static void OnLapChangedCallback(Changed<KartLapController> changed) {
        var maxLaps = GameManager.Instance.GameType.lapCount;
        var isPracticeMode = GameManager.Instance.GameType.IsPracticeMode();
        var behaviour = changed.Behaviour;
        var behaviours = changed.Behaviour.GetComponentsInChildren<KartComponent>();

        var isFinish = !isPracticeMode && behaviour.Lap - 1 == maxLaps;
        
        foreach ( var b in behaviours )
            b.OnLapCompleted(behaviour.Lap, isFinish);

        behaviour.OnLapChanged?.Invoke(behaviour.Lap, maxLaps);
    }

    private static void CheckpointIndexChanged(Changed<KartLapController> changed) {
        var behaviour = changed.Behaviour;
        var nObject = behaviour.Object;

        if ( !nObject.HasInputAuthority ) return;

        // -1 means checkpoint is the finish line itself
        if ( behaviour.CheckpointIndex != -1 ) {
            AudioManager.Play("errorSFX", AudioManager.MixerTarget.SFX);
        }
    }

    public void ProcessCheckpoint(Checkpoint checkpoint) {
        
        //
        // This is called every frame we are in contact with the finish line, so we need to make double sure that
        // nothing is getting incremented lots of times per second. Notice we increment 'CheckpointIndex'.
        //
        
        // if Game type is practice
        if ( GameManager.Instance.GameType.IsPracticeMode() ) {
            CheckpointIndex = checkpoint.index;
            return;
        }

        // if current checkpoint is the one directly after the previous checkpoints
        if ( CheckpointIndex == checkpoint.index - 1 ) {
            CheckpointIndex++;
        }
    }

    public void ProcessFinishLine(FinishLine finishLine) {
        
        //
        // This is called every frame we are in contact with the finish line, so we need to make double sure that
        // nothing is getting incremented lots of times per second. Notice we reset 'CheckpointIndex' back to -1.
        //
        
        var gameType = GameManager.Instance.GameType;
        var checkpoints = GameManager.CurrentTrack.checkpoints;
        
        if ( gameType.IsPracticeMode() ) {
            CheckpointIndex = -1;
            return;
        }

        // Iff we are on the last checkpoint, proceed to 'complete' a lap. (Or if we are in debug)
        if ( CheckpointIndex == checkpoints.Length - 1 || finishLine.debug ) {
            // If we have just started the race we dont want to complete a lap. This is a small workaround.
            if ( Lap == 0 ) return;
        
            // Add our current tick to the LapTicks networked property so we can keep track of race times.
            LapTicks.Set(Lap - 1, Runner.Simulation.Tick);

            // Increment the lap and reset the checkpoint index to -1. This tells checkpoint code that we have just
            // touched the finish line.
            Lap++;
            CheckpointIndex = -1;
        }
    }

    /// <summary>
    /// Returns the total time we have been racing for, in seconds.
    /// </summary>
    /// <returns></returns>
    public float GetTotalRaceTime() {
        if ( !Runner.IsRunning || StartRaceTick == 0 )
            return 0f;

        var endTick = EndRaceTick == 0 ? Runner.Simulation.Tick.Raw : EndRaceTick;
        return TickHelper.TickToSeconds(Runner, endTick - StartRaceTick);
    }
}