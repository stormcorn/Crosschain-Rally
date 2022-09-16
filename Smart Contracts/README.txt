//CAR DB CONTRACT

This contract serves as an on-chain database
for car stats and rarity mapping. This emulates
a conventional web2 DB.

//CAR DBA(Database Administrator)

This contract allows for streamlined addtions of
new cars to the car DB. Built to be used easily with
one-click-dapp.com.

Using Mjolnir RBAC, this contract can be upgraded or
used with multiversioning at any point.

//SFT BASE (ERC1155)

This contract holds all of the base-level ERC1155 logic
and balance mapping. Using Mjolnir, this contract is intended
to be used with modules that are treated like consumables.
Being able to add, change, or remove other contracts that can
call its onlyThor functions.

//CAR PRESALE

This contract allows for minting of the Car SFT. This is a
module for the Mjolnir base and after the presale cap is met, 
it will be discarded in favor of a new contract with different 
purchase logic.

Car boxes can yield either of 2 cars depending on the box type.

The randomization is powered by a demo mini version of our 
LiquidRNGv2 system deployed on many other chains. 

The system is powered by the random investment actions of people on 
high-volume smart contracts. We cannot predict what the actions of many people
are, therefore it is very hard to predict the outcome if not impossible.

Cronos cannot yet support the full LiquidRNGv2 as it does not have enough
high-volume contracts yet. A single randomization unit can be safely implented
in the LiquidRNGv2Mini.