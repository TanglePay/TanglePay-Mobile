

let client_;

export const setWeb3Client = (client) => {
	client_ = client;
};

// eth_getBlockByNumber
export const ethGetBlockByNumber = async (blockHashOrBlockNumber, returnTransactionObjects) => {
	const res = await client_?.eth.getBlock(blockHashOrBlockNumber, returnTransactionObjects);
	return res;
};

// eth_gasPrice
export const ethGasPrice = async () => {
	const res = await client_?.eth.getGasPrice();
	return res;
};

// eth_sign
export const ethSign = async (dataToSign, address) => {
	const res = await client_?.eth.sign(dataToSign, address);
	return res;
};

// eth_personal_sign
export const ethPersonalSign = async (dataToSign, address, password) => {
	const res = await client_?.eth.personal.sign(dataToSign, address, password);
	return res;
};
