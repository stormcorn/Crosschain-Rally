using System.Numerics;
using MoralisUnity.Web3Api.Models;
using MoralisUnity;
using Nethereum.Util;
using TMPro;
using UnityEngine;


namespace Cronos_Hackathon_Starter_Sample
{
    public class Web3GameManager : MonoBehaviour
    {
        [Header("Main Components")]
        public WalletController wallet;

        [Header("UI")]
        public TextMeshProUGUI balanceLabel;
        public TextMeshProUGUI WalletAddressLabel;
        //  public TextMeshProUGUI TokenidLabel;
        public async void StartGame()
        {
            //player.input.EnableInput(true);
            wallet.walletAddress.Activate();

            // Get native balance
            NativeBalance nativeBalance = await Web3Tools.GetNativeBalance();

            // Convert it to number
            var integerBalance = BigInteger.Parse(nativeBalance.Balance);

            // Convert wei to native
            var formattedBalance = UnitConversion.Convert.FromWei(integerBalance);

            balanceLabel.text = formattedBalance.ToString();

            WalletAddressLabel.text = Web3Tools.GetWalletAddress().ToString();

            fetchNFTs();
           

        }

        public async void fetchNFTs()
        {
            //取NFT主合約所有賽車 id metadata json
            //NftCollection nfts = await Moralis.Web3Api.Token.GetAllTokenIds(address: "0xe3ced1e769bb4bd79e63c8a00e3ccd4db952a95d", ChainList.cronos, null, null, 10);
            
            
            //取用戶Account的NFT id metadata json
            NftOwnerCollection nfts = await Moralis.Web3Api.Account.GetNFTs(address:"0x71999f9fFD6916d56627C799163bB7510D64D83d", ChainList.cronos);
            Debug.Log(nfts.ToJson());


        }
        }
    }
