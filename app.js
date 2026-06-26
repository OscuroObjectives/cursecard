const contractAddress =
"0xF5f88D0559e151AFC47206184bd02cC29b683106";

let imageVerified = false;

const abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "wallet",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "CurseCardSigned",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "signContract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getSignature",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSignatures",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

let provider;
let signer;
let contract;

async function verifyImage() {

    const fileInput =
        document.getElementById("imageInput");

    if (fileInput.files.length === 0) {

        alert("Please choose an image.");

        return;

    }

    const formData = new FormData();

    formData.append(
        "image",
        fileInput.files[0]
    );

    document.getElementById("status").innerHTML =
        "Verifying image...";

    try {

        const response =
            await fetch(
                "https://cursecard.onrender.com/verify",
                {
                    method: "POST",
                    body: formData
                }
            );

        const result =
            await response.json();

        if(result.verified){

            imageVerified = true;

            document.getElementById("status").innerHTML =
                "CURSE CARD VERIFIED";

            document.getElementById("signButton")
                .disabled = false;

        }
        else{

            imageVerified = false;

            document.getElementById("status").innerHTML =
                "IMAGE REJECTED";

            document.getElementById("signButton")
                .disabled = true;

        }

    }

    catch(error){

        console.log(error);

        document.getElementById("status").innerHTML =
            "Verification Error";

    }

}
async function connectWallet() {

    if (!window.ethereum) {

        alert("Please install MetaMask.");

        return;

    }

    await window.ethereum.request({
        method: "eth_requestAccounts"
    });

    provider =
        new ethers.providers.Web3Provider(window.ethereum);

    signer =
        provider.getSigner();

    contract =
        new ethers.Contract(
            contractAddress,
            abi,
            signer
        );

    document.getElementById("status").innerHTML =
        "Wallet Connected";
}

async function signCurseContract() {

    if(!imageVerified){

        alert("Please verify the Curse Card first.");
        return;

    }

    if (!contract) {

        alert("Please connect MetaMask first.");
        return;

    }

    try {

        const name =
            document
            .getElementById("nameInput")
            .value
            .trim();

        if(name.length === 0){

            alert("Please enter your name.");

            return;

        }

        const message =

`CURSE CARD AUTHORIZATION

Name:

${name}

By signing this declaration, I acknowledge that I have requested custody of the Curse Card.

I understand that my wallet address, my name, and the date of signing will be permanently recorded on the blockchain.

Only after completing this authorization may custody of the Curse Card be transferred.

This signature confirms the spiritual and contractual bounding of the Curse Card asset and the my ownership of the physical Curse Card. After the transfer has been made, I will take on the energy of the Curse Card which passes on the curse of bad luck on to me until I give both the card and Curse Card asset to another person.`;

        // MetaMask Signature Popup
        await signer.signMessage(message);

        document.getElementById("status").innerHTML =
            "Submitting transaction...";

        // Blockchain Transaction
        const tx =
            await contract.signContract(name);

        await tx.wait();

        document.getElementById("status").innerHTML =
            "Contract Successfully Signed";

    }

    catch(error){

        console.log(error);

        document.getElementById("status").innerHTML =
            "Transaction Cancelled";

    }

}

document
.getElementById("connectButton")
.onclick =
connectWallet;

document
.getElementById("signButton")
.onclick =
signCurseContract;

document
.getElementById("signButton")
.disabled = true;

document
.getElementById("verifyImageButton")
.onclick =
verifyImage;