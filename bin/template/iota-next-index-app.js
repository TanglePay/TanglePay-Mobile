(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined'
		? factory(
				exports,
				require('node-fetch'),
				require('@iota/crypto.js-next'),
				require('@iota/util.js-next'),
				require('big-integer')
		  )
		: typeof define === 'function' && define.amd
		? define(['exports', 'node-fetch', '@iota/crypto.js-next', '@iota/util.js-next', 'big-integer'], factory)
		: ((global = typeof globalThis !== 'undefined' ? globalThis : global || self),
		  factory((global.Iota = {}), global['node-fetch'], global.IotaCrypto, global.IotaUtil, global.bigInt));
})(this, function (exports, require$$0, crypto_js, util_js, bigInt) {
	'use strict';

	function _interopDefaultLegacy(e) {
		return e && typeof e === 'object' && 'default' in e ? e : { default: e };
	}

	var require$$0__default = /*#__PURE__*/ _interopDefaultLegacy(require$$0);
	var bigInt__default = /*#__PURE__*/ _interopDefaultLegacy(bigInt);

	// Copyright 2020 IOTA Stiftung
	// SPDX-License-Identifier: Apache-2.0
	// Fetch
	if (globalThis && !globalThis.fetch) {
		// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
		const fetch = require$$0__default['default'];
		globalThis.Headers = fetch.Headers;
		globalThis.Request = fetch.Request;
		globalThis.Response = fetch.Response;
		globalThis.fetch = fetch;
	}

	// Copyright 2020 IOTA Stiftung
	/**
	 * Class to help with Ed25519 Signature scheme.
	 */
	class Ed25519Address {
		/**
		 * Create a new instance of Ed25519Address.
		 * @param publicKey The public key for the address.
		 */
		constructor(publicKey) {
			this._publicKey = publicKey;
		}
		/**
		 * Convert the public key to an address.
		 * @returns The address.
		 */
		toAddress() {
			return crypto_js.Blake2b.sum256(this._publicKey);
		}
		/**
		 * Use the public key to validate the address.
		 * @param address The address to verify.
		 * @returns True if the data and address is verified.
		 */
		verify(address) {
			return crypto_js.ArrayHelper.equal(this.toAddress(), address);
		}
	}
	/**
	 * Address size.
	 * @internal
	 */
	Ed25519Address.ADDRESS_LENGTH = crypto_js.Blake2b.SIZE_256;

	/**
	 * The global type for the alias address type.
	 */
	const ALIAS_ADDRESS_TYPE = 8;

	/**
	 * The global type for the ed25519 address type.
	 */
	const ED25519_ADDRESS_TYPE = 0;

	/**
	 * The global type for the NFT address type.
	 */
	const NFT_ADDRESS_TYPE = 16;

	// Copyright 2020 IOTA Stiftung
	/**
	 * Byte length for a uint8 field.
	 */
	const UINT8_SIZE = 1;
	/**
	 * Byte length for a uint16 field.
	 */
	const UINT16_SIZE = 2;
	/**
	 * Byte length for a uint32 field.
	 */
	const UINT32_SIZE = 4;
	/**
	 * Byte length for a uint64 field.
	 */
	const UINT64_SIZE = 8;
	/**
	 * Byte length for a uint256 field.
	 */
	const UINT256_SIZE = 32;
	/**
	 * Byte length for a block id.
	 */
	const BLOCK_ID_LENGTH = crypto_js.Blake2b.SIZE_256;
	/**
	 * Byte length for a transaction id.
	 */
	const TRANSACTION_ID_LENGTH = crypto_js.Blake2b.SIZE_256;
	/**
	 * Byte length for a merkle prrof.
	 */
	const MERKLE_PROOF_LENGTH = crypto_js.Blake2b.SIZE_256;
	/**
	 * Byte length for a type length.
	 */
	const TYPE_LENGTH = UINT32_SIZE;
	/**
	 * Byte length for a small type length.
	 */
	const SMALL_TYPE_LENGTH = UINT8_SIZE;
	/**
	 * Byte length for a string length.
	 */
	const STRING_LENGTH = UINT16_SIZE;
	/**
	 * Byte length for an array length.
	 */
	const ARRAY_LENGTH = UINT16_SIZE;

	// A better place for this id would be in outputs/aliasOutput, but importing it from there
	// causes other constats computed from it to have value NaN during serialization
	/* eslint-disable no-warning-comments */
	// TODO: Find fix for the weird typescript issue
	/**
	 * The length of an alias id.
	 */
	const ALIAS_ID_LENGTH = 32;
	/**
	 * The minimum length of an alias address binary representation.
	 */
	const MIN_ALIAS_ADDRESS_LENGTH = SMALL_TYPE_LENGTH + ALIAS_ID_LENGTH;
	/**
	 * Deserialize the alias address from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeAliasAddress(readStream) {
		if (!readStream.hasRemaining(MIN_ALIAS_ADDRESS_LENGTH)) {
			throw new Error(
				`Alias address data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_ALIAS_ADDRESS_LENGTH}`
			);
		}
		const type = readStream.readUInt8('aliasAddress.type');
		if (type !== ALIAS_ADDRESS_TYPE) {
			throw new Error(`Type mismatch in aliasAddress ${type}`);
		}
		const address = readStream.readFixedHex('aliasAddress.aliasId', ALIAS_ID_LENGTH);
		return {
			type: ALIAS_ADDRESS_TYPE,
			aliasId: address
		};
	}
	/**
	 * Serialize the alias address to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeAliasAddress(writeStream, object) {
		writeStream.writeUInt8('aliasAddress.type', object.type);
		writeStream.writeFixedHex('aliasAddress.aliasId', ALIAS_ID_LENGTH, object.aliasId);
	}

	/**
	 * The minimum length of an ed25519 address binary representation.
	 */
	const MIN_ED25519_ADDRESS_LENGTH = SMALL_TYPE_LENGTH + Ed25519Address.ADDRESS_LENGTH;
	/**
	 * Deserialize the Ed25519 address from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeEd25519Address(readStream) {
		if (!readStream.hasRemaining(MIN_ED25519_ADDRESS_LENGTH)) {
			throw new Error(
				`Ed25519 address data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_ED25519_ADDRESS_LENGTH}`
			);
		}
		const type = readStream.readUInt8('ed25519Address.type');
		if (type !== ED25519_ADDRESS_TYPE) {
			throw new Error(`Type mismatch in ed25519Address ${type}`);
		}
		const address = readStream.readFixedHex('ed25519Address.pubKeyHash', Ed25519Address.ADDRESS_LENGTH);
		return {
			type: ED25519_ADDRESS_TYPE,
			pubKeyHash: address
		};
	}
	/**
	 * Serialize the ed25519 address to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeEd25519Address(writeStream, object) {
		writeStream.writeUInt8('ed25519Address.type', object.type);
		writeStream.writeFixedHex('ed25519Address.pubKeyHash', Ed25519Address.ADDRESS_LENGTH, object.pubKeyHash);
	}

	// A better place for this id would be in outputs/nftOutput, but importing it from there
	// causes other constats computed from it to have value NaN during serialization
	/* eslint-disable no-warning-comments */
	// TODO: Find fix for the weird typescript issue
	/**
	 * The length of an NFT Id.
	 */
	const NFT_ID_LENGTH = 32;
	/**
	 * The minimum length of an nft address binary representation.
	 */
	const MIN_NFT_ADDRESS_LENGTH = SMALL_TYPE_LENGTH + NFT_ID_LENGTH;
	/**
	 * Deserialize the nft address from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeNftAddress(readStream) {
		if (!readStream.hasRemaining(MIN_NFT_ADDRESS_LENGTH)) {
			throw new Error(
				`NFT address data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_NFT_ADDRESS_LENGTH}`
			);
		}
		const type = readStream.readUInt8('nftAddress.type');
		if (type !== NFT_ADDRESS_TYPE) {
			throw new Error(`Type mismatch in nftAddress ${type}`);
		}
		const address = readStream.readFixedHex('nftAddress.nftId', NFT_ID_LENGTH);
		return {
			type: NFT_ADDRESS_TYPE,
			nftId: address
		};
	}
	/**
	 * Serialize the nft address to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeNftAddress(writeStream, object) {
		writeStream.writeUInt8('nftAddress.type', object.type);
		writeStream.writeFixedHex('nftAddress.nftId', NFT_ID_LENGTH, object.nftId);
	}

	/**
	 * The minimum length of an address binary representation.
	 */
	const MIN_ADDRESS_LENGTH = Math.min(MIN_ED25519_ADDRESS_LENGTH, MIN_ALIAS_ADDRESS_LENGTH, MIN_NFT_ADDRESS_LENGTH);
	/**
	 * Deserialize the address from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeAddress(readStream) {
		if (!readStream.hasRemaining(MIN_ADDRESS_LENGTH)) {
			throw new Error(
				`Address data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_ADDRESS_LENGTH}`
			);
		}
		const type = readStream.readUInt8('address.type', false);
		let address;
		if (type === ED25519_ADDRESS_TYPE) {
			address = deserializeEd25519Address(readStream);
		} else if (type === ALIAS_ADDRESS_TYPE) {
			address = deserializeAliasAddress(readStream);
		} else if (type === NFT_ADDRESS_TYPE) {
			address = deserializeNftAddress(readStream);
		} else {
			throw new Error(`Unrecognized address type ${type}`);
		}
		return address;
	}
	/**
	 * Serialize the address to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeAddress(writeStream, object) {
		if (object.type === ED25519_ADDRESS_TYPE) {
			serializeEd25519Address(writeStream, object);
		} else if (object.type === ALIAS_ADDRESS_TYPE) {
			serializeAliasAddress(writeStream, object);
		} else if (object.type === NFT_ADDRESS_TYPE) {
			serializeNftAddress(writeStream, object);
		} else {
			throw new Error(`Unrecognized address type ${object.type}`);
		}
	}

	/**
	 * The global type for the issuer feature.
	 */
	const ISSUER_FEATURE_TYPE = 1;

	/**
	 * The global type for the metadata feature.
	 */
	const METADATA_FEATURE_TYPE = 2;

	/**
	 * The global type for the sender feature.
	 */
	const SENDER_FEATURE_TYPE = 0;

	/**
	 * The global type for the tag feature.
	 */
	const TAG_FEATURE_TYPE = 3;

	/**
	 * The minimum length of a issuer feature binary representation.
	 */
	const MIN_ISSUER_FEATURE_LENGTH = SMALL_TYPE_LENGTH + MIN_ADDRESS_LENGTH;
	/**
	 * Deserialize the issuer feature from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeIssuerFeature(readStream) {
		if (!readStream.hasRemaining(MIN_ISSUER_FEATURE_LENGTH)) {
			throw new Error(
				`Issuer Feature data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_ISSUER_FEATURE_LENGTH}`
			);
		}
		const type = readStream.readUInt8('issuerFeature.type');
		if (type !== ISSUER_FEATURE_TYPE) {
			throw new Error(`Type mismatch in issuerFeature ${type}`);
		}
		const address = deserializeAddress(readStream);
		return {
			type: ISSUER_FEATURE_TYPE,
			address
		};
	}
	/**
	 * Serialize the issuer feature to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeIssuerFeature(writeStream, object) {
		writeStream.writeUInt8('issuerFeature.type', object.type);
		serializeAddress(writeStream, object.address);
	}

	// Copyright 2020 IOTA Stiftung
	/**
	 * The minimum length of a metadata feature block binary representation.
	 */
	const MIN_METADATA_FEATURE_LENGTH = SMALL_TYPE_LENGTH + UINT16_SIZE;
	/**
	 * Deserialize the metadata feature block from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeMetadataFeature(readStream) {
		if (!readStream.hasRemaining(MIN_METADATA_FEATURE_LENGTH)) {
			throw new Error(
				`Metadata Feature data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_METADATA_FEATURE_LENGTH}`
			);
		}
		const type = readStream.readUInt8('metadataFeature.type');
		if (type !== METADATA_FEATURE_TYPE) {
			throw new Error(`Type mismatch in metadataFeature ${type}`);
		}
		const dataLength = readStream.readUInt16('metadataFeature.dataLength');
		const data = readStream.readFixedHex('metadataFeature.data', dataLength);
		return {
			type: METADATA_FEATURE_TYPE,
			data
		};
	}
	/**
	 * Serialize the metadata feature to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeMetadataFeature(writeStream, object) {
		writeStream.writeUInt8('metadataFeature.type', object.type);
		const data = util_js.HexHelper.stripPrefix(object.data);
		writeStream.writeUInt16('metadataFeature.dataLength', data.length / 2);
		writeStream.writeFixedHex('metadataFeature.data', data.length / 2, data);
	}

	/**
	 * The minimum length of a sender feature binary representation.
	 */
	const MIN_SENDER_FEATURE_LENGTH = SMALL_TYPE_LENGTH + MIN_ADDRESS_LENGTH;
	/**
	 * Deserialize the sender feature from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeSenderFeature(readStream) {
		if (!readStream.hasRemaining(MIN_SENDER_FEATURE_LENGTH)) {
			throw new Error(
				`Sender Feature data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_SENDER_FEATURE_LENGTH}`
			);
		}
		const type = readStream.readUInt8('senderFeature.type');
		if (type !== SENDER_FEATURE_TYPE) {
			throw new Error(`Type mismatch in senderFeature ${type}`);
		}
		const address = deserializeAddress(readStream);
		return {
			type: SENDER_FEATURE_TYPE,
			address
		};
	}
	/**
	 * Serialize the sender feature to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeSenderFeature(writeStream, object) {
		writeStream.writeUInt8('senderFeature.type', object.type);
		serializeAddress(writeStream, object.address);
	}

	// Copyright 2020 IOTA Stiftung
	/**
	 * The minimum length of a tag feature binary representation.
	 */
	const MIN_TAG_FEATURE_LENGTH =
		SMALL_TYPE_LENGTH + // Type
		UINT8_SIZE; // Length
	/**
	 * Deserialize the tag feature from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeTagFeature(readStream) {
		if (!readStream.hasRemaining(MIN_TAG_FEATURE_LENGTH)) {
			throw new Error(
				`Tag Feature data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_TAG_FEATURE_LENGTH}`
			);
		}
		const type = readStream.readUInt8('tagFeature.type');
		if (type !== TAG_FEATURE_TYPE) {
			throw new Error(`Type mismatch in tagFeature ${type}`);
		}
		const tagLength = readStream.readUInt8('tagFeature.tagLength');
		const tag = readStream.readFixedHex('tagFeature.tag', tagLength);
		return {
			type: TAG_FEATURE_TYPE,
			tag
		};
	}
	/**
	 * Serialize the tag feature to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeTagFeature(writeStream, object) {
		writeStream.writeUInt8('tagFeature.type', object.type);
		const tag = util_js.HexHelper.stripPrefix(object.tag);
		writeStream.writeUInt8('tagFeature.tagLength', tag.length / 2);
		writeStream.writeFixedHex('tagFeature.tag', tag.length / 2, tag);
	}

	/**
	 * The minimum length of a featurs tokens list.
	 */
	const MIN_FEATURES_LENGTH = UINT8_SIZE;
	/**
	 * The minimum length of a feature binary representation.
	 */
	const MIN_FEATURE_LENGTH = Math.min(
		MIN_SENDER_FEATURE_LENGTH,
		MIN_ISSUER_FEATURE_LENGTH,
		MIN_METADATA_FEATURE_LENGTH,
		MIN_TAG_FEATURE_LENGTH
	);
	/**
	 * Deserialize the feature from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeFeatures(readStream) {
		const numFeatures = readStream.readUInt8('features.numFeatures');
		const features = [];
		for (let i = 0; i < numFeatures; i++) {
			features.push(deserializeFeature(readStream));
		}
		return numFeatures > 0 ? features : undefined;
	}
	/**
	 * Serialize the feature to binary.
	 * @param writeStream The stream to write the data to.
	 * @param objects The objects to serialize.
	 */
	function serializeFeatures(writeStream, objects) {
		var _a;
		writeStream.writeUInt8(
			'features.numFeatures',
			(_a = objects === null || objects === void 0 ? void 0 : objects.length) !== null && _a !== void 0 ? _a : 0
		);
		if (!objects) {
			return;
		}
		for (let i = 0; i < objects.length; i++) {
			serializeFeature(writeStream, objects[i]);
		}
	}
	/**
	 * Deserialize the feature from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeFeature(readStream) {
		if (!readStream.hasRemaining(MIN_FEATURE_LENGTH)) {
			throw new Error(
				`Feature data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_FEATURE_LENGTH}`
			);
		}
		const type = readStream.readUInt8('feature.type', false);
		let input;
		if (type === SENDER_FEATURE_TYPE) {
			input = deserializeSenderFeature(readStream);
		} else if (type === ISSUER_FEATURE_TYPE) {
			input = deserializeIssuerFeature(readStream);
		} else if (type === METADATA_FEATURE_TYPE) {
			input = deserializeMetadataFeature(readStream);
		} else if (type === TAG_FEATURE_TYPE) {
			input = deserializeTagFeature(readStream);
		} else {
			throw new Error(`Unrecognized feature type ${type}`);
		}
		return input;
	}
	/**
	 * Serialize the feature to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeFeature(writeStream, object) {
		if (object.type === SENDER_FEATURE_TYPE) {
			serializeSenderFeature(writeStream, object);
		} else if (object.type === ISSUER_FEATURE_TYPE) {
			serializeIssuerFeature(writeStream, object);
		} else if (object.type === METADATA_FEATURE_TYPE) {
			serializeMetadataFeature(writeStream, object);
		} else if (object.type === TAG_FEATURE_TYPE) {
			serializeTagFeature(writeStream, object);
		} else {
			throw new Error(`Unrecognized feature type ${object.type}`);
		}
	}

	/**
	 * The length of the tail hash length in bytes.
	 */
	const TAIL_HASH_LENGTH = 49;
	/**
	 * The minimum length of a migrated fund binary representation.
	 */
	const MIN_MIGRATED_FUNDS_LENGTH =
		TAIL_HASH_LENGTH + // tailTransactionHash
		MIN_ADDRESS_LENGTH + // address
		UINT64_SIZE; // deposit
	/**
	 * The maximum number of funds.
	 */
	const MAX_FUNDS_COUNT = 127;
	/**
	 * Deserialize the receipt payload funds from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeFunds(readStream) {
		const numFunds = readStream.readUInt16('funds.numFunds');
		const funds = [];
		for (let i = 0; i < numFunds; i++) {
			funds.push(deserializeMigratedFunds(readStream));
		}
		return funds;
	}
	/**
	 * Serialize the receipt payload funds to binary.
	 * @param writeStream The stream to write the data to.
	 * @param objects The objects to serialize.
	 */
	function serializeFunds(writeStream, objects) {
		if (objects.length > MAX_FUNDS_COUNT) {
			throw new Error(`The maximum number of funds is ${MAX_FUNDS_COUNT}, you have provided ${objects.length}`);
		}
		writeStream.writeUInt16('funds.numFunds', objects.length);
		for (let i = 0; i < objects.length; i++) {
			serializeMigratedFunds(writeStream, objects[i]);
		}
	}
	/**
	 * Deserialize the migrated fund from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeMigratedFunds(readStream) {
		if (!readStream.hasRemaining(MIN_MIGRATED_FUNDS_LENGTH)) {
			throw new Error(
				`Migrated funds data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_MIGRATED_FUNDS_LENGTH}`
			);
		}
		const tailTransactionHash = readStream.readFixedHex('migratedFunds.tailTransactionHash', TAIL_HASH_LENGTH);
		const address = deserializeAddress(readStream);
		const deposit = readStream.readUInt64('migratedFunds.deposit');
		return {
			tailTransactionHash,
			address,
			deposit: deposit.toString()
		};
	}
	/**
	 * Serialize the migrated funds to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeMigratedFunds(writeStream, object) {
		writeStream.writeFixedHex('migratedFunds.tailTransactionHash', TAIL_HASH_LENGTH, object.tailTransactionHash);
		serializeAddress(writeStream, object.address);
		writeStream.writeUInt64('migratedFunds.deposit', bigInt__default['default'](object.deposit));
	}

	/**
	 * The global type for the treasury input.
	 */
	const TREASURY_INPUT_TYPE = 1;

	/**
	 * The global type for the input.
	 */
	const UTXO_INPUT_TYPE = 0;

	/**
	 * The minimum length of a treasury input binary representation.
	 */
	const MIN_TREASURY_INPUT_LENGTH = SMALL_TYPE_LENGTH + TRANSACTION_ID_LENGTH;
	/**
	 * Deserialize the treasury input from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeTreasuryInput(readStream) {
		if (!readStream.hasRemaining(MIN_TREASURY_INPUT_LENGTH)) {
			throw new Error(
				`Treasury Input data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_TREASURY_INPUT_LENGTH}`
			);
		}
		const type = readStream.readUInt8('treasuryInput.type');
		if (type !== TREASURY_INPUT_TYPE) {
			throw new Error(`Type mismatch in treasuryInput ${type}`);
		}
		const milestoneId = readStream.readFixedHex('treasuryInput.milestoneId', TRANSACTION_ID_LENGTH);
		return {
			type: TREASURY_INPUT_TYPE,
			milestoneId
		};
	}
	/**
	 * Serialize the treasury input to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeTreasuryInput(writeStream, object) {
		writeStream.writeUInt8('treasuryInput.type', object.type);
		writeStream.writeFixedHex('treasuryInput.milestoneId', TRANSACTION_ID_LENGTH, object.milestoneId);
	}

	/**
	 * The minimum length of a utxo input binary representation.
	 */
	const MIN_UTXO_INPUT_LENGTH = SMALL_TYPE_LENGTH + TRANSACTION_ID_LENGTH + UINT16_SIZE;
	/**
	 * Deserialize the utxo input from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeUTXOInput(readStream) {
		if (!readStream.hasRemaining(MIN_UTXO_INPUT_LENGTH)) {
			throw new Error(
				`UTXO Input data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_UTXO_INPUT_LENGTH}`
			);
		}
		const type = readStream.readUInt8('utxoInput.type');
		if (type !== UTXO_INPUT_TYPE) {
			throw new Error(`Type mismatch in utxoInput ${type}`);
		}
		const transactionId = readStream.readFixedHex('utxoInput.transactionId', TRANSACTION_ID_LENGTH);
		const transactionOutputIndex = readStream.readUInt16('utxoInput.transactionOutputIndex');
		return {
			type: UTXO_INPUT_TYPE,
			transactionId,
			transactionOutputIndex
		};
	}
	/**
	 * Serialize the utxo input to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeUTXOInput(writeStream, object) {
		writeStream.writeUInt8('utxoInput.type', object.type);
		writeStream.writeFixedHex('utxoInput.transactionId', TRANSACTION_ID_LENGTH, object.transactionId);
		writeStream.writeUInt16('utxoInput.transactionOutputIndex', object.transactionOutputIndex);
	}

	/**
	 * The minimum length of an input binary representation.
	 */
	const MIN_INPUT_LENGTH = Math.min(MIN_UTXO_INPUT_LENGTH, MIN_TREASURY_INPUT_LENGTH);
	/**
	 * The minimum number of inputs.
	 */
	const MIN_INPUT_COUNT = 1;
	/**
	 * The maximum number of inputs.
	 */
	const MAX_INPUT_COUNT = 128;
	/**
	 * Deserialize the inputs from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeInputs(readStream) {
		const numInputs = readStream.readUInt16('inputs.numInputs');
		const inputs = [];
		for (let i = 0; i < numInputs; i++) {
			inputs.push(deserializeInput(readStream));
		}
		return inputs;
	}
	/**
	 * Serialize the inputs to binary.
	 * @param writeStream The stream to write the data to.
	 * @param objects The objects to serialize.
	 */
	function serializeInputs(writeStream, objects) {
		if (objects.length < MIN_INPUT_COUNT) {
			throw new Error(`The minimum number of inputs is ${MIN_INPUT_COUNT}, you have provided ${objects.length}`);
		}
		if (objects.length > MAX_INPUT_COUNT) {
			throw new Error(`The maximum number of inputs is ${MAX_INPUT_COUNT}, you have provided ${objects.length}`);
		}
		writeStream.writeUInt16('inputs.numInputs', objects.length);
		for (let i = 0; i < objects.length; i++) {
			serializeInput(writeStream, objects[i]);
		}
	}
	/**
	 * Deserialize the input from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeInput(readStream) {
		if (!readStream.hasRemaining(MIN_INPUT_LENGTH)) {
			throw new Error(
				`Input data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_INPUT_LENGTH}`
			);
		}
		const type = readStream.readUInt8('input.type', false);
		let input;
		if (type === UTXO_INPUT_TYPE) {
			input = deserializeUTXOInput(readStream);
		} else if (type === TREASURY_INPUT_TYPE) {
			input = deserializeTreasuryInput(readStream);
		} else {
			throw new Error(`Unrecognized input type ${type}`);
		}
		return input;
	}
	/**
	 * Serialize the input to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeInput(writeStream, object) {
		if (object.type === UTXO_INPUT_TYPE) {
			serializeUTXOInput(writeStream, object);
		} else if (object.type === TREASURY_INPUT_TYPE) {
			serializeTreasuryInput(writeStream, object);
		} else {
			throw new Error(`Unrecognized input type ${object.type}`);
		}
	}

	/**
	 * The default protocol version.
	 */
	const DEFAULT_PROTOCOL_VERSION = 2;

	/**
	 * The global type for the payload.
	 */
	const MILESTONE_PAYLOAD_TYPE = 7;

	/**
	 * The global type for the payload.
	 */
	const TAGGED_DATA_PAYLOAD_TYPE = 5;

	/**
	 * The global type for the payload.
	 */
	const TRANSACTION_PAYLOAD_TYPE = 6;

	/**
	 * The global type for the payload.
	 */
	const TREASURY_TRANSACTION_PAYLOAD_TYPE = 4;

	/**
	 * The global type for the option.
	 */
	const PROTOCOL_PARAMETERS_MILESTONE_OPTION_TYPE = 1;

	/**
	 * The global type for the option.
	 */
	const RECEIPT_MILESTONE_OPTION_TYPE = 0;

	// Copyright 2020 IOTA Stiftung
	/**
	 * The minimum length of a protocol params milestone option binary representation.
	 */
	const MIN_PROTOCOL_PARAMS_MILESTONE_OPTION_LENGTH =
		SMALL_TYPE_LENGTH + // type
		UINT32_SIZE + // targetMilestoneIndex
		SMALL_TYPE_LENGTH + // protocolVersion
		UINT16_SIZE; // params
	/**
	 * Deserialize the protocol params milestone option from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeProtocolParamsMilestoneOption(readStream) {
		if (!readStream.hasRemaining(MIN_PROTOCOL_PARAMS_MILESTONE_OPTION_LENGTH)) {
			throw new Error(
				`Protocol params Milestone Option data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_PROTOCOL_PARAMS_MILESTONE_OPTION_LENGTH}`
			);
		}
		const type = readStream.readUInt8('protocolParamsMilestoneOption.type');
		if (type !== PROTOCOL_PARAMETERS_MILESTONE_OPTION_TYPE) {
			throw new Error(`Type mismatch in protocolParamsMilestoneOption ${type}`);
		}
		const targetMilestoneIndex = readStream.readUInt32('protocolParamsMilestoneOption.targetMilestoneIndex');
		const protocolVersion = readStream.readUInt8('protocolParamsMilestoneOption.protocolVersion');
		const paramsLength = readStream.readUInt16('payloadMilestone.paramsLength');
		const params = readStream.readFixedHex('payloadMilestone.metadata', paramsLength);
		return {
			type: PROTOCOL_PARAMETERS_MILESTONE_OPTION_TYPE,
			targetMilestoneIndex,
			protocolVersion,
			params
		};
	}
	/**
	 * Serialize the protocol params milestone option to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeProtocolParamsMilestoneOption(writeStream, object) {
		writeStream.writeUInt8('protocolParamsMilestoneOption.type', object.type);
		writeStream.writeUInt32('protocolParamsMilestoneOption.targetMilestoneIndex', object.targetMilestoneIndex);
		writeStream.writeUInt8('protocolParamsMilestoneOption.protocolVersion', object.protocolVersion);
		const params = util_js.HexHelper.stripPrefix(object.params);
		writeStream.writeUInt16('protocolParamsMilestoneOption.paramsLength', params.length / 2);
		writeStream.writeFixedHex('protocolParamsMilestoneOption.params', params.length / 2, params);
	}

	/**
	 * The minimum length of a receipt milestone option binary representation.
	 */
	const MIN_RECEIPT_MILESTONE_OPTION_LENGTH =
		SMALL_TYPE_LENGTH +
		UINT32_SIZE + // migratedAt
		UINT16_SIZE + // numFunds
		MIN_MIGRATED_FUNDS_LENGTH; // 1 Fund
	/**
	 * Deserialize the receipt milestone option from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeReceiptMilestoneOption(readStream) {
		if (!readStream.hasRemaining(MIN_RECEIPT_MILESTONE_OPTION_LENGTH)) {
			throw new Error(
				`Receipt Milestone Option data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_RECEIPT_MILESTONE_OPTION_LENGTH}`
			);
		}
		const type = readStream.readUInt8('receiptMilestoneOption.type');
		if (type !== RECEIPT_MILESTONE_OPTION_TYPE) {
			throw new Error(`Type mismatch in receiptMilestoneOption ${type}`);
		}
		const migratedAt = readStream.readUInt32('receiptMilestoneOption.migratedAt');
		const final = readStream.readBoolean('receiptMilestoneOption.final');
		const funds = deserializeFunds(readStream);
		const treasuryTransactionPayload = deserializePayload(readStream);
		if (
			(treasuryTransactionPayload === null || treasuryTransactionPayload === void 0
				? void 0
				: treasuryTransactionPayload.type) !== TREASURY_TRANSACTION_PAYLOAD_TYPE
		) {
			throw new Error(`receiptMilestoneOption can only contain treasury payloads ${type}`);
		}
		return {
			type: RECEIPT_MILESTONE_OPTION_TYPE,
			migratedAt,
			final,
			funds,
			transaction: treasuryTransactionPayload
		};
	}
	/**
	 * Serialize the receipt milestone option to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeReceiptMilestoneOption(writeStream, object) {
		writeStream.writeUInt8('receiptMilestoneOption.type', object.type);
		writeStream.writeUInt32('receiptMilestoneOption.migratedAt', object.migratedAt);
		writeStream.writeBoolean('receiptMilestoneOption.final', object.final);
		serializeFunds(writeStream, object.funds);
		serializePayload(writeStream, object.transaction);
	}

	/**
	 * The minimum length of a milestone option binary representation.
	 */
	const MIN_MILESTONE_OPTION_LENGTH = Math.min(
		MIN_RECEIPT_MILESTONE_OPTION_LENGTH,
		MIN_PROTOCOL_PARAMS_MILESTONE_OPTION_LENGTH
	);
	/**
	 * Deserialize the milestone options from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeMilestoneOptions(readStream) {
		const optionsCount = readStream.readUInt8('milestoneOptions.optionsCount');
		const milestoneOptions = [];
		for (let i = 0; i < optionsCount; i++) {
			milestoneOptions.push(deserializeMilestoneOption(readStream));
		}
		return milestoneOptions;
	}
	/**
	 * Serialize the milestone options to binary.
	 * @param writeStream The stream to write the data to.
	 * @param objects The objects to serialize.
	 */
	function serializeMilestoneOptions(writeStream, objects) {
		writeStream.writeUInt8('milestoneOptions.optionsCount', objects.length);
		for (let i = 0; i < objects.length; i++) {
			serializeMilestoneOption(writeStream, objects[i]);
		}
	}
	/**
	 * Deserialize the milestone options from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeMilestoneOption(readStream) {
		if (!readStream.hasRemaining(MIN_MILESTONE_OPTION_LENGTH)) {
			throw new Error(
				`Milestone option data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_MILESTONE_OPTION_LENGTH}`
			);
		}
		const type = readStream.readUInt8('milestoneOption.type', false);
		let option;
		if (type === RECEIPT_MILESTONE_OPTION_TYPE) {
			option = deserializeReceiptMilestoneOption(readStream);
		} else if (type === PROTOCOL_PARAMETERS_MILESTONE_OPTION_TYPE) {
			option = deserializeProtocolParamsMilestoneOption(readStream);
		} else {
			throw new Error(`Unrecognized milestone option type ${type}`);
		}
		return option;
	}
	/**
	 * Serialize the milestone option to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeMilestoneOption(writeStream, object) {
		if (object.type === RECEIPT_MILESTONE_OPTION_TYPE) {
			serializeReceiptMilestoneOption(writeStream, object);
		} else if (object.type === PROTOCOL_PARAMETERS_MILESTONE_OPTION_TYPE) {
			serializeProtocolParamsMilestoneOption(writeStream, object);
		} else {
			throw new Error(`Unrecognized milestone option type ${object.type}`);
		}
	}

	/**
	 * The global type for the signature type.
	 */
	const ED25519_SIGNATURE_TYPE = 0;

	// Copyright 2020 IOTA Stiftung
	/**
	 * The minimum length of an ed25519 signature binary representation.
	 */
	const MIN_ED25519_SIGNATURE_LENGTH =
		SMALL_TYPE_LENGTH + crypto_js.Ed25519.SIGNATURE_SIZE + crypto_js.Ed25519.PUBLIC_KEY_SIZE;
	/**
	 * Deserialize the Ed25519 signature from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeEd25519Signature(readStream) {
		if (!readStream.hasRemaining(MIN_ED25519_SIGNATURE_LENGTH)) {
			throw new Error(
				`Ed25519 signature data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_ED25519_SIGNATURE_LENGTH}`
			);
		}
		const type = readStream.readUInt8('ed25519Signature.type');
		if (type !== ED25519_SIGNATURE_TYPE) {
			throw new Error(`Type mismatch in ed25519Signature ${type}`);
		}
		const publicKey = readStream.readFixedHex('ed25519Signature.publicKey', crypto_js.Ed25519.PUBLIC_KEY_SIZE);
		const signature = readStream.readFixedHex('ed25519Signature.signature', crypto_js.Ed25519.SIGNATURE_SIZE);
		return {
			type: ED25519_SIGNATURE_TYPE,
			publicKey,
			signature
		};
	}
	/**
	 * Serialize the Ed25519 signature to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeEd25519Signature(writeStream, object) {
		writeStream.writeUInt8('ed25519Signature.type', object.type);
		writeStream.writeFixedHex('ed25519Signature.publicKey', crypto_js.Ed25519.PUBLIC_KEY_SIZE, object.publicKey);
		writeStream.writeFixedHex('ed25519Signature.signature', crypto_js.Ed25519.SIGNATURE_SIZE, object.signature);
	}

	/**
	 * The minimum length of a signature binary representation.
	 */
	const MIN_SIGNATURE_LENGTH = MIN_ED25519_SIGNATURE_LENGTH;
	/**
	 * Deserialize the signature from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeSignature(readStream) {
		if (!readStream.hasRemaining(MIN_SIGNATURE_LENGTH)) {
			throw new Error(
				`Signature data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_SIGNATURE_LENGTH}`
			);
		}
		const type = readStream.readUInt8('signature.type', false);
		let signature;
		if (type === ED25519_SIGNATURE_TYPE) {
			signature = deserializeEd25519Signature(readStream);
		} else {
			throw new Error(`Unrecognized signature type ${type}`);
		}
		return signature;
	}
	/**
	 * Serialize the signature to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeSignature(writeStream, object) {
		if (object.type === ED25519_SIGNATURE_TYPE) {
			serializeEd25519Signature(writeStream, object);
		} else {
			throw new Error(`Unrecognized signature type ${object.type}`);
		}
	}

	/**
	 * The minimum length of a milestone payload binary representation.
	 */
	const MIN_MILESTONE_PAYLOAD_LENGTH =
		TYPE_LENGTH + // min payload
		UINT32_SIZE + // index
		UINT32_SIZE + // timestamp
		BLOCK_ID_LENGTH + // last milestone id
		BLOCK_ID_LENGTH + // parent 1
		BLOCK_ID_LENGTH + // parent 2
		2 * MERKLE_PROOF_LENGTH + // merkle proof
		UINT8_SIZE + // optionsCount
		UINT16_SIZE + // metadata
		UINT8_SIZE + // signatureCount
		MIN_ED25519_SIGNATURE_LENGTH; // 1 signature
	/**
	 * Deserialize the milestone payload from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeMilestonePayload(readStream) {
		if (!readStream.hasRemaining(MIN_MILESTONE_PAYLOAD_LENGTH)) {
			throw new Error(
				`Milestone Payload data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_MILESTONE_PAYLOAD_LENGTH}`
			);
		}
		const type = readStream.readUInt32('payloadMilestone.type');
		if (type !== MILESTONE_PAYLOAD_TYPE) {
			throw new Error(`Type mismatch in payloadMilestone ${type}`);
		}
		const index = readStream.readUInt32('payloadMilestone.index');
		const timestamp = readStream.readUInt32('payloadMilestone.timestamp');
		const protocolVersion = readStream.readUInt8('payloadMileston.protocolVersion');
		const previousMilestoneId = readStream.readFixedHex('payloadMilestone.previousMilestoneId', BLOCK_ID_LENGTH);
		const numParents = readStream.readUInt8('payloadMilestone.numParents');
		const parents = [];
		for (let i = 0; i < numParents; i++) {
			const parentBlockId = readStream.readFixedHex(`payloadMilestone.parentBlockId${i + 1}`, BLOCK_ID_LENGTH);
			parents.push(parentBlockId);
		}
		const inclusionMerkleRoot = readStream.readFixedHex(
			'payloadMilestone.inclusionMerkleRoot',
			MERKLE_PROOF_LENGTH
		);
		const appliedMerkleRoot = readStream.readFixedHex('payloadMilestone.appliedMerkleRoot', MERKLE_PROOF_LENGTH);
		const metadataLength = readStream.readUInt16('payloadMilestone.metadataLength');
		const metadata = readStream.readFixedHex('payloadMilestone.metadata', metadataLength);
		const options = deserializeMilestoneOptions(readStream);
		const signaturesCount = readStream.readUInt8('payloadMilestone.signaturesCount');
		const signatures = [];
		for (let i = 0; i < signaturesCount; i++) {
			signatures.push(deserializeSignature(readStream));
		}
		return {
			type: MILESTONE_PAYLOAD_TYPE,
			index,
			timestamp: Number(timestamp),
			protocolVersion,
			previousMilestoneId,
			parents,
			inclusionMerkleRoot,
			appliedMerkleRoot,
			metadata,
			options,
			signatures
		};
	}
	/**
	 * Serialize the milestone payload to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeMilestonePayload(writeStream, object) {
		writeStream.writeUInt32('payloadMilestone.type', object.type);
		serializeMilestoneEssence(writeStream, object);
		writeStream.writeUInt8('payloadMilestone.signaturesCount', object.signatures.length);
		for (let i = 0; i < object.signatures.length; i++) {
			serializeSignature(writeStream, object.signatures[i]);
		}
	}
	/**
	 * Serialize the milestone payload to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeMilestoneEssence(writeStream, object) {
		writeStream.writeUInt32('payloadMilestone.index', object.index);
		writeStream.writeUInt32('payloadMilestone.timestamp', object.timestamp);
		writeStream.writeUInt8('payloadMilesone.protocolVersion', object.protocolVersion);
		writeStream.writeFixedHex('payloadMilestone.previousMilestoneId', BLOCK_ID_LENGTH, object.previousMilestoneId);
		if (object.parents.length < MIN_NUMBER_PARENTS) {
			throw new Error(
				`A minimum of ${MIN_NUMBER_PARENTS} parents is allowed, you provided ${object.parents.length}`
			);
		}
		if (object.parents.length > MAX_NUMBER_PARENTS) {
			throw new Error(
				`A maximum of ${MAX_NUMBER_PARENTS} parents is allowed, you provided ${object.parents.length}`
			);
		}
		if (new Set(object.parents).size !== object.parents.length) {
			throw new Error('The milestone parents must be unique');
		}
		const sorted = object.parents.slice().sort();
		writeStream.writeUInt8('payloadMilestone.numParents', object.parents.length);
		for (let i = 0; i < object.parents.length; i++) {
			if (sorted[i] !== object.parents[i]) {
				throw new Error('The milestone parents must be lexographically sorted');
			}
			writeStream.writeFixedHex(`payloadMilestone.parentBlockId${i + 1}`, BLOCK_ID_LENGTH, object.parents[i]);
		}
		writeStream.writeFixedHex(
			'payloadMilestone.inclusionMerkleRoot',
			MERKLE_PROOF_LENGTH,
			object.inclusionMerkleRoot
		);
		writeStream.writeFixedHex('payloadMilestone.appliedMerkleRoot', MERKLE_PROOF_LENGTH, object.appliedMerkleRoot);
		if (object.metadata) {
			const metadata = util_js.HexHelper.stripPrefix(object.metadata);
			writeStream.writeUInt16('payloadMilestone.metadataLength', metadata.length / 2);
			if (metadata.length > 0) {
				writeStream.writeFixedHex('payloadMilestone.metadata', metadata.length / 2, metadata);
			}
		} else {
			writeStream.writeUInt16('payloadMilestone.metadataLength', 0);
		}
		if (object.options) {
			serializeMilestoneOptions(writeStream, object.options);
		} else {
			writeStream.writeUInt8('milestoneOptions.optionsCount', 0);
		}
	}

	// Copyright 2020 IOTA Stiftung
	/**
	 * The minimum length of a tagged data payload binary representation.
	 */
	const MIN_TAGGED_DATA_PAYLOAD_LENGTH =
		TYPE_LENGTH + // min payload
		UINT8_SIZE + // tag length
		UINT32_SIZE; // data length
	/**
	 * The maximum length of a tag.
	 */
	const MAX_TAG_LENGTH = 64;
	/**
	 * Deserialize the tagged data payload from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeTaggedDataPayload(readStream) {
		if (!readStream.hasRemaining(MIN_TAGGED_DATA_PAYLOAD_LENGTH)) {
			throw new Error(
				`Tagged Data Payload data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_TAGGED_DATA_PAYLOAD_LENGTH}`
			);
		}
		const type = readStream.readUInt32('payloadTaggedData.type');
		if (type !== TAGGED_DATA_PAYLOAD_TYPE) {
			throw new Error(`Type mismatch in payloadTaggedData ${type}`);
		}
		const tagLength = readStream.readUInt8('payloadTaggedData.tagLength');
		let tag = '';
		if (tagLength > 0) {
			tag = readStream.readFixedHex('payloadTaggedData.tag', tagLength);
		}
		const dataLength = readStream.readUInt32('payloadTaggedData.dataLength');
		let data = '';
		if (dataLength > 0) {
			data = readStream.readFixedHex('payloadTaggedData.data', dataLength);
		}
		return {
			type: TAGGED_DATA_PAYLOAD_TYPE,
			tag: tag ? util_js.HexHelper.addPrefix(tag) : tag,
			data: data ? util_js.HexHelper.addPrefix(data) : data
		};
	}
	/**
	 * Serialize the tagged data payload to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeTaggedDataPayload(writeStream, object) {
		if (object.tag && object.tag.length / 2 > MAX_TAG_LENGTH) {
			throw new Error(
				`The tag length is ${object.tag.length / 2}, which exceeds the maximum size of ${MAX_TAG_LENGTH}`
			);
		}
		writeStream.writeUInt32('payloadTaggedData.type', object.type);
		if (object.tag) {
			const tag = util_js.HexHelper.stripPrefix(object.tag);
			writeStream.writeUInt8('payloadTaggedData.tagLength', tag.length / 2);
			if (tag.length > 0) {
				writeStream.writeFixedHex('payloadTaggedData.tag', tag.length / 2, tag);
			}
		} else {
			writeStream.writeUInt32('payloadTaggedData.tagLength', 0);
		}
		if (object.data) {
			const data = util_js.HexHelper.stripPrefix(object.data);
			writeStream.writeUInt32('payloadTaggedData.dataLength', data.length / 2);
			if (data.length > 0) {
				writeStream.writeFixedHex('payloadTaggedData.data', data.length / 2, data);
			}
		} else {
			writeStream.writeUInt32('payloadTaggedData.dataLength', 0);
		}
	}

	// Copyright 2020 IOTA Stiftung
	/**
	 * The global type for the transaction essence.
	 */
	const TRANSACTION_ESSENCE_TYPE = 1;
	/**
	 * Inputs commitment size.
	 */
	const INPUTS_COMMITMENT_SIZE = crypto_js.Blake2b.SIZE_256;

	/**
	 * The global type for the alias output.
	 */
	const ALIAS_OUTPUT_TYPE = 4;

	/**
	 * The global type for the basic output.
	 */
	const BASIC_OUTPUT_TYPE = 3;

	/**
	 * The global type for the foundry output.
	 */
	const FOUNDRY_OUTPUT_TYPE = 5;

	/**
	 * The global type for the NFT output.
	 */
	const NFT_OUTPUT_TYPE = 6;

	/**
	 * The global type for the treasury output.
	 */
	const TREASURY_OUTPUT_TYPE = 2;

	// Copyright 2020 IOTA Stiftung
	/**
	 * The minimum length of a native tokens list.
	 */
	const MIN_NATIVE_TOKENS_LENGTH = UINT8_SIZE;
	/**
	 * The length of a foundry id.
	 */
	const FOUNDRY_ID_LENGTH = MIN_ALIAS_ADDRESS_LENGTH + UINT32_SIZE + UINT8_SIZE;
	/**
	 * The length of a native token id.
	 */
	const NATIVE_TOKEN_ID_LENGTH = FOUNDRY_ID_LENGTH;
	/**
	 * The maximum number of native tokens.
	 */
	const MAX_NATIVE_TOKEN_COUNT = 64;
	/**
	 * Deserialize the natovetokens from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeNativeTokens(readStream) {
		const numNativeTokens = readStream.readUInt8('nativeTokens.numNativeTokens');
		const nativeTokens = [];
		for (let i = 0; i < numNativeTokens; i++) {
			nativeTokens.push(deserializeNativeToken(readStream));
		}
		return numNativeTokens > 0 ? nativeTokens : undefined;
	}
	/**
	 * Serialize the natove tokens to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeNativeTokens(writeStream, object) {
		var _a;
		writeStream.writeUInt8(
			'nativeTokens.numNativeTokens',
			(_a = object === null || object === void 0 ? void 0 : object.length) !== null && _a !== void 0 ? _a : 0
		);
		if (!object) {
			return;
		}
		for (let i = 0; i < object.length; i++) {
			serializeNativeToken(writeStream, object[i]);
		}
	}
	/**
	 * Deserialize the native token from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeNativeToken(readStream) {
		const id = readStream.readFixedHex('nativeToken.id', NATIVE_TOKEN_ID_LENGTH);
		const amount = readStream.readUInt256('nativeToken.amount');
		return {
			id,
			amount: util_js.HexHelper.fromBigInt256(amount)
		};
	}
	/**
	 * Serialize the native token to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeNativeToken(writeStream, object) {
		writeStream.writeFixedHex('nativeToken.id', NATIVE_TOKEN_ID_LENGTH, object.id);
		writeStream.writeUInt256('nativeToken.amount', util_js.HexHelper.toBigInt256(object.amount));
	}

	/**
	 * The global type for the address unlock condition.
	 */
	const ADDRESS_UNLOCK_CONDITION_TYPE = 0;

	/**
	 * The global type for the expiration unlock condition.
	 */
	const EXPIRATION_UNLOCK_CONDITION_TYPE = 3;

	/**
	 * The global type for the governor address unlock condition.
	 */
	const GOVERNOR_ADDRESS_UNLOCK_CONDITION_TYPE = 5;

	/**
	 * The global type for the immutable alias unlock condition.
	 */
	const IMMUTABLE_ALIAS_UNLOCK_CONDITION_TYPE = 6;

	/**
	 * The global type for the state controller unlock condition.
	 */
	const STATE_CONTROLLER_ADDRESS_UNLOCK_CONDITION_TYPE = 4;

	/**
	 * The global type for the storage deposit return unlock condition.
	 */
	const STORAGE_DEPOSIT_RETURN_UNLOCK_CONDITION_TYPE = 1;

	/**
	 * The global type for the timelock unlock condition.
	 */
	const TIMELOCK_UNLOCK_CONDITION_TYPE = 2;

	/**
	 * The minimum length of an address unlock condition binary representation.
	 */
	const MIN_ADDRESS_UNLOCK_CONDITION_LENGTH = SMALL_TYPE_LENGTH + MIN_ADDRESS_LENGTH;
	/**
	 * Deserialize the address unlock condition from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeAddressUnlockCondition(readStream) {
		if (!readStream.hasRemaining(MIN_ADDRESS_UNLOCK_CONDITION_LENGTH)) {
			throw new Error(
				`Address unlock condition data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_ADDRESS_UNLOCK_CONDITION_LENGTH}`
			);
		}
		const type = readStream.readUInt8('addressUnlockCondition.type');
		if (type !== ADDRESS_UNLOCK_CONDITION_TYPE) {
			throw new Error(`Type mismatch in addressUnlockCondition ${type}`);
		}
		const address = deserializeAddress(readStream);
		return {
			type: ADDRESS_UNLOCK_CONDITION_TYPE,
			address
		};
	}
	/**
	 * Serialize the address unlock condition to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeAddressUnlockCondition(writeStream, object) {
		writeStream.writeUInt8('addressUnlockCondition.type', object.type);
		serializeAddress(writeStream, object.address);
	}

	/**
	 * The minimum length of an expiration unlock condition binary representation.
	 */
	const MIN_EXPIRATION_UNLOCK_CONDITION_LENGTH = SMALL_TYPE_LENGTH + MIN_ADDRESS_LENGTH + UINT32_SIZE;
	/**
	 * Deserialize the expiration unlock condition from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeExpirationUnlockCondition(readStream) {
		if (!readStream.hasRemaining(MIN_EXPIRATION_UNLOCK_CONDITION_LENGTH)) {
			throw new Error(
				`Expiration unlock condition data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_EXPIRATION_UNLOCK_CONDITION_LENGTH}`
			);
		}
		const type = readStream.readUInt8('expirationUnlockCondition.type');
		if (type !== EXPIRATION_UNLOCK_CONDITION_TYPE) {
			throw new Error(`Type mismatch in expirationUnlockCondition ${type}`);
		}
		const returnAddress = deserializeAddress(readStream);
		const unixTime = readStream.readUInt32('expirationUnlockCondition.unixTime');
		const expirationUnlockCondition = {
			type: EXPIRATION_UNLOCK_CONDITION_TYPE,
			returnAddress,
			unixTime
		};
		return expirationUnlockCondition;
	}
	/**
	 * Serialize the expiration unlock condition to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeExpirationUnlockCondition(writeStream, object) {
		writeStream.writeUInt8('expirationUnlockCondition.type', object.type);
		serializeAddress(writeStream, object.returnAddress);
		writeStream.writeUInt32('expirationUnlockCondition.unixTime', object.unixTime);
	}

	/**
	 * The minimum length of an immutable alias unlock condition binary representation.
	 */
	const MIN_IMMUTABLE_ALIAS_UNLOCK_CONDITION_LENGTH = SMALL_TYPE_LENGTH + MIN_ADDRESS_LENGTH;
	/**
	 * Deserialize the immutable alias unlock condition from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeImmutableAliasUnlockCondition(readStream) {
		if (!readStream.hasRemaining(MIN_IMMUTABLE_ALIAS_UNLOCK_CONDITION_LENGTH)) {
			throw new Error(
				`Immutable Alias unlock condition data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_IMMUTABLE_ALIAS_UNLOCK_CONDITION_LENGTH}`
			);
		}
		const type = readStream.readUInt8('immutableAliasUnlockCondition.type');
		if (type !== IMMUTABLE_ALIAS_UNLOCK_CONDITION_TYPE) {
			throw new Error(`Type mismatch in immutableAliasUnlockCondition ${type}`);
		}
		const address = deserializeAddress(readStream);
		return {
			type: IMMUTABLE_ALIAS_UNLOCK_CONDITION_TYPE,
			address
		};
	}
	/**
	 * Serialize the immutable alias unlock condition to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeImmutableAliasUnlockCondition(writeStream, object) {
		writeStream.writeUInt8('immutableAliasUnlockCondition.type', object.type);
		serializeAddress(writeStream, object.address);
	}

	/**
	 * The minimum length of an timelock unlock condition binary representation.
	 */
	const MIN_TIMELOCK_UNLOCK_CONDITION_LENGTH = SMALL_TYPE_LENGTH + UINT32_SIZE;
	/**
	 * Deserialize the timelock unlock condition from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeTimelockUnlockCondition(readStream) {
		if (!readStream.hasRemaining(MIN_TIMELOCK_UNLOCK_CONDITION_LENGTH)) {
			throw new Error(
				`Timelock unlock condition data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_TIMELOCK_UNLOCK_CONDITION_LENGTH}`
			);
		}
		const type = readStream.readUInt8('timelockUnlockCondition.type');
		if (type !== TIMELOCK_UNLOCK_CONDITION_TYPE) {
			throw new Error(`Type mismatch in timelockUnlockCondition ${type}`);
		}
		const unixTime = readStream.readUInt32('timelockUnlockCondition.unixTime');
		const timelockUnlockCondition = {
			type: TIMELOCK_UNLOCK_CONDITION_TYPE,
			unixTime
		};
		return timelockUnlockCondition;
	}
	/**
	 * Serialize the timelock unlock condition to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeTimelockUnlockCondition(writeStream, object) {
		writeStream.writeUInt8('timelockUnlockCondition.type', object.type);
		writeStream.writeUInt32('timelockUnlockCondition.unixTime', object.unixTime);
	}

	/**
	 * The minimum length of an governor unlock condition binary representation.
	 */
	const MIN_GOVERNOR_ADDRESS_UNLOCK_CONDITION_LENGTH = SMALL_TYPE_LENGTH + MIN_ADDRESS_LENGTH;
	/**
	 * Deserialize the governor address unlock condition from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeGovernorAddressUnlockCondition(readStream) {
		if (!readStream.hasRemaining(MIN_GOVERNOR_ADDRESS_UNLOCK_CONDITION_LENGTH)) {
			throw new Error(
				`Governor unlock condition data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_GOVERNOR_ADDRESS_UNLOCK_CONDITION_LENGTH}`
			);
		}
		const type = readStream.readUInt8('governorUnlockCondition.type');
		if (type !== GOVERNOR_ADDRESS_UNLOCK_CONDITION_TYPE) {
			throw new Error(`Type mismatch in governorUnlockCondition ${type}`);
		}
		const address = deserializeAddress(readStream);
		return {
			type: GOVERNOR_ADDRESS_UNLOCK_CONDITION_TYPE,
			address
		};
	}
	/**
	 * Serialize the governor address unlock condition to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeGovernorAddressUnlockCondition(writeStream, object) {
		writeStream.writeUInt8('governorUnlockCondition.type', object.type);
		serializeAddress(writeStream, object.address);
	}

	/**
	 * The minimum length of an state controller address unlock condition binary representation.
	 */
	const MIN_STATE_CONTROLLER_ADDRESS_UNLOCK_CONDITION_LENGTH = SMALL_TYPE_LENGTH + MIN_ADDRESS_LENGTH;
	/**
	 * Deserialize the state controller address unlock condition from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeStateControllerAddressUnlockCondition(readStream) {
		if (!readStream.hasRemaining(MIN_STATE_CONTROLLER_ADDRESS_UNLOCK_CONDITION_LENGTH)) {
			throw new Error(
				`State controller addres unlock condition data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_STATE_CONTROLLER_ADDRESS_UNLOCK_CONDITION_LENGTH}`
			);
		}
		const type = readStream.readUInt8('stateControllerAddresUnlockCondition.type');
		if (type !== STATE_CONTROLLER_ADDRESS_UNLOCK_CONDITION_TYPE) {
			throw new Error(`Type mismatch in stateControllerAddresUnlockCondition ${type}`);
		}
		const address = deserializeAddress(readStream);
		return {
			type: STATE_CONTROLLER_ADDRESS_UNLOCK_CONDITION_TYPE,
			address
		};
	}
	/**
	 * Serialize the state controller address unlock condition to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeStateControllerAddressUnlockCondition(writeStream, object) {
		writeStream.writeUInt8('stateControllerAddressUnlockCondition.type', object.type);
		serializeAddress(writeStream, object.address);
	}

	/**
	 * The minimum length of an storage deposit return unlock condition binary representation.
	 */
	const MIN_STORAGE_DEPOSIT_RETURN_UNLOCK_CONDITION_LENGTH = SMALL_TYPE_LENGTH + MIN_ADDRESS_LENGTH + UINT64_SIZE;
	/**
	 * Deserialize the storage deposit return unlock condition from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeStorageDepositReturnUnlockCondition(readStream) {
		if (!readStream.hasRemaining(MIN_STORAGE_DEPOSIT_RETURN_UNLOCK_CONDITION_LENGTH)) {
			throw new Error(
				`Storage deposit return unlock condition data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_STORAGE_DEPOSIT_RETURN_UNLOCK_CONDITION_LENGTH}`
			);
		}
		const type = readStream.readUInt8('storageDepositReturnUnlockCondition.type');
		if (type !== STORAGE_DEPOSIT_RETURN_UNLOCK_CONDITION_TYPE) {
			throw new Error(`Type mismatch in storagDepositReturnUnlockCondition ${type}`);
		}
		const returnAddress = deserializeAddress(readStream);
		const amount = readStream.readUInt64('storageDepositReturnUnlockCondition.amount');
		return {
			type: STORAGE_DEPOSIT_RETURN_UNLOCK_CONDITION_TYPE,
			returnAddress,
			amount: amount.toString()
		};
	}
	/**
	 * Serialize the storage deposit return unlock condition to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeStorageDepositReturnUnlockCondition(writeStream, object) {
		writeStream.writeUInt8('storageDepositReturnUnlockCondition.type', object.type);
		serializeAddress(writeStream, object.returnAddress);
		writeStream.writeUInt64(
			'storageDepositReturnUnlockCondition.amount',
			bigInt__default['default'](object.amount)
		);
	}

	/**
	 * The minimum length of a unlock conditions list.
	 */
	const MIN_UNLOCK_CONDITIONS_LENGTH = UINT8_SIZE;
	/**
	 * The minimum length of a unlock conditions binary representation.
	 */
	const MIN_UNLOCK_CONDITION_LENGTH = Math.min(
		MIN_ADDRESS_UNLOCK_CONDITION_LENGTH,
		MIN_STORAGE_DEPOSIT_RETURN_UNLOCK_CONDITION_LENGTH,
		MIN_TIMELOCK_UNLOCK_CONDITION_LENGTH,
		MIN_EXPIRATION_UNLOCK_CONDITION_LENGTH,
		MIN_STATE_CONTROLLER_ADDRESS_UNLOCK_CONDITION_LENGTH,
		MIN_GOVERNOR_ADDRESS_UNLOCK_CONDITION_LENGTH,
		MIN_IMMUTABLE_ALIAS_UNLOCK_CONDITION_LENGTH
	);
	/**
	 * Deserialize the unlock conditions from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeUnlockConditions(readStream) {
		const numUnlockConditions = readStream.readUInt8('unlockConditions.numUnlockConditions');
		const unlockConditions = [];
		for (let i = 0; i < numUnlockConditions; i++) {
			unlockConditions.push(deserializeUnlockCondition(readStream));
		}
		return unlockConditions;
	}
	/**
	 * Serialize the unlock conditions to binary.
	 * @param writeStream The stream to write the data to.
	 * @param objects The objects to serialize.
	 */
	function serializeUnlockConditions(writeStream, objects) {
		writeStream.writeUInt8('unlockConditions.numUnlockConditions', objects.length);
		for (let i = 0; i < objects.length; i++) {
			serializeUnlockCondition(writeStream, objects[i]);
		}
	}
	/**
	 * Deserialize the unlock condition from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeUnlockCondition(readStream) {
		if (!readStream.hasRemaining(MIN_UNLOCK_CONDITION_LENGTH)) {
			throw new Error(
				`Unlock condition data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_UNLOCK_CONDITION_LENGTH}`
			);
		}
		const type = readStream.readUInt8('unlockCondition.type', false);
		let input;
		if (type === ADDRESS_UNLOCK_CONDITION_TYPE) {
			input = deserializeAddressUnlockCondition(readStream);
		} else if (type === STORAGE_DEPOSIT_RETURN_UNLOCK_CONDITION_TYPE) {
			input = deserializeStorageDepositReturnUnlockCondition(readStream);
		} else if (type === TIMELOCK_UNLOCK_CONDITION_TYPE) {
			input = deserializeTimelockUnlockCondition(readStream);
		} else if (type === EXPIRATION_UNLOCK_CONDITION_TYPE) {
			input = deserializeExpirationUnlockCondition(readStream);
		} else if (type === STATE_CONTROLLER_ADDRESS_UNLOCK_CONDITION_TYPE) {
			input = deserializeStateControllerAddressUnlockCondition(readStream);
		} else if (type === GOVERNOR_ADDRESS_UNLOCK_CONDITION_TYPE) {
			input = deserializeGovernorAddressUnlockCondition(readStream);
		} else if (type === IMMUTABLE_ALIAS_UNLOCK_CONDITION_TYPE) {
			input = deserializeImmutableAliasUnlockCondition(readStream);
		} else {
			throw new Error(`Unrecognized unlock condition type ${type}`);
		}
		return input;
	}
	/**
	 * Serialize the unlock condition to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeUnlockCondition(writeStream, object) {
		if (object.type === ADDRESS_UNLOCK_CONDITION_TYPE) {
			serializeAddressUnlockCondition(writeStream, object);
		} else if (object.type === STORAGE_DEPOSIT_RETURN_UNLOCK_CONDITION_TYPE) {
			serializeStorageDepositReturnUnlockCondition(writeStream, object);
		} else if (object.type === TIMELOCK_UNLOCK_CONDITION_TYPE) {
			serializeTimelockUnlockCondition(writeStream, object);
		} else if (object.type === EXPIRATION_UNLOCK_CONDITION_TYPE) {
			serializeExpirationUnlockCondition(writeStream, object);
		} else if (object.type === STATE_CONTROLLER_ADDRESS_UNLOCK_CONDITION_TYPE) {
			serializeStateControllerAddressUnlockCondition(writeStream, object);
		} else if (object.type === GOVERNOR_ADDRESS_UNLOCK_CONDITION_TYPE) {
			serializeGovernorAddressUnlockCondition(writeStream, object);
		} else if (object.type === IMMUTABLE_ALIAS_UNLOCK_CONDITION_TYPE) {
			serializeImmutableAliasUnlockCondition(writeStream, object);
		} else {
			throw new Error(`Unrecognized unlock condition type ${object.type}`);
		}
	}

	// Copyright 2020 IOTA Stiftung
	/**
	 * The minimum length of a alias output binary representation.
	 */
	const MIN_ALIAS_OUTPUT_LENGTH =
		SMALL_TYPE_LENGTH + // Type
		UINT64_SIZE + // Amount
		MIN_NATIVE_TOKENS_LENGTH + // Native Tokens
		ALIAS_ID_LENGTH + // Alias Id
		UINT32_SIZE + // State Index
		UINT16_SIZE + // State Metatata Length
		UINT32_SIZE + // Foundry counter
		MIN_UNLOCK_CONDITIONS_LENGTH + // Unlock conditions
		MIN_FEATURES_LENGTH + // Features
		MIN_FEATURES_LENGTH; // Immutable feature
	/**
	 * Deserialize the alias output from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeAliasOutput(readStream) {
		if (!readStream.hasRemaining(MIN_ALIAS_OUTPUT_LENGTH)) {
			throw new Error(
				`Alias Output data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_ALIAS_OUTPUT_LENGTH}`
			);
		}
		const type = readStream.readUInt8('aliasOutput.type');
		if (type !== ALIAS_OUTPUT_TYPE) {
			throw new Error(`Type mismatch in aliasOutput ${type}`);
		}
		const amount = readStream.readUInt64('aliasOutput.amount');
		const nativeTokens = deserializeNativeTokens(readStream);
		const aliasId = readStream.readFixedHex('aliasOutput.aliasId', ALIAS_ID_LENGTH);
		const stateIndex = readStream.readUInt32('aliasOutput.stateIndex');
		const stateMetadataLength = readStream.readUInt16('aliasOutput.stateMetadataLength');
		const stateMetadata =
			stateMetadataLength > 0
				? readStream.readFixedHex('aliasOutput.stateMetadata', stateMetadataLength)
				: undefined;
		const foundryCounter = readStream.readUInt32('aliasOutput.foundryCounter');
		const unlockConditions = deserializeUnlockConditions(readStream);
		const features = deserializeFeatures(readStream);
		const immutableFeatures = deserializeFeatures(readStream);
		return {
			type: ALIAS_OUTPUT_TYPE,
			amount: amount.toString(),
			nativeTokens,
			aliasId,
			stateIndex,
			stateMetadata,
			foundryCounter,
			unlockConditions,
			features,
			immutableFeatures
		};
	}
	/**
	 * Serialize the alias output to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeAliasOutput(writeStream, object) {
		var _a, _b, _c;
		writeStream.writeUInt8('aliasOutput.type', object.type);
		writeStream.writeUInt64('aliasOutput.amount', bigInt__default['default'](object.amount));
		serializeNativeTokens(writeStream, (_a = object.nativeTokens) !== null && _a !== void 0 ? _a : []);
		writeStream.writeFixedHex('aliasOutput.aliasId', ALIAS_ID_LENGTH, object.aliasId);
		writeStream.writeUInt32('aliasOutput.stateIndex', object.stateIndex);
		if (object.stateMetadata) {
			const stateMetadata = util_js.HexHelper.stripPrefix(object.stateMetadata);
			writeStream.writeUInt16('aliasOutput.stateMetadataLength', stateMetadata.length / 2);
			if (stateMetadata.length > 0) {
				writeStream.writeFixedHex('aliasOutput.stateMetadata', stateMetadata.length / 2, stateMetadata);
			}
		} else {
			writeStream.writeUInt16('aliasOutput.stateMetadataLength', 0);
		}
		writeStream.writeUInt32('aliasOutput.foundryCounter', object.foundryCounter);
		serializeUnlockConditions(writeStream, object.unlockConditions);
		serializeFeatures(writeStream, (_b = object.features) !== null && _b !== void 0 ? _b : []);
		serializeFeatures(writeStream, (_c = object.immutableFeatures) !== null && _c !== void 0 ? _c : []);
	}

	/**
	 * The minimum length of a basic output binary representation.
	 */
	const MIN_BASIC_OUTPUT_LENGTH =
		SMALL_TYPE_LENGTH + // Type
		UINT64_SIZE + // Amount
		MIN_NATIVE_TOKENS_LENGTH + // Native Tokens
		MIN_UNLOCK_CONDITIONS_LENGTH + // Unlock conditions
		MIN_FEATURE_LENGTH; // Features
	/**
	 * Deserialize the basic output from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeBasicOutput(readStream) {
		if (!readStream.hasRemaining(MIN_BASIC_OUTPUT_LENGTH)) {
			throw new Error(
				`Basic Output data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_BASIC_OUTPUT_LENGTH}`
			);
		}
		const type = readStream.readUInt8('basicOutput.type');
		if (type !== BASIC_OUTPUT_TYPE) {
			throw new Error(`Type mismatch in basicOutput ${type}`);
		}
		const amount = readStream.readUInt64('basicOutput.amount');
		const nativeTokens = deserializeNativeTokens(readStream);
		const unlockConditions = deserializeUnlockConditions(readStream);
		const features = deserializeFeatures(readStream);
		return {
			type: BASIC_OUTPUT_TYPE,
			amount: amount.toString(),
			nativeTokens,
			unlockConditions,
			features
		};
	}
	/**
	 * Serialize the basic output to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeBasicOutput(writeStream, object) {
		writeStream.writeUInt8('basicOutput.type', object.type);
		writeStream.writeUInt64('basicOutput.amount', bigInt__default['default'](object.amount));
		serializeNativeTokens(writeStream, object.nativeTokens);
		serializeUnlockConditions(writeStream, object.unlockConditions);
		serializeFeatures(writeStream, object.features);
	}

	/**
	 * The global type for the simple token scheme.
	 */
	const SIMPLE_TOKEN_SCHEME_TYPE = 0;

	/**
	 * The minimum length of an simple token scheme binary representation.
	 */
	const MIN_SIMPLE_TOKEN_SCHEME_LENGTH =
		SMALL_TYPE_LENGTH + // type
		UINT256_SIZE + // Minted
		UINT256_SIZE + // Melted
		UINT256_SIZE; // Maximum Supply;
	/**
	 * Deserialize the simple token scheme from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeSimpleTokenScheme(readStream) {
		if (!readStream.hasRemaining(MIN_SIMPLE_TOKEN_SCHEME_LENGTH)) {
			throw new Error(
				`Simple Token Scheme data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_SIMPLE_TOKEN_SCHEME_LENGTH}`
			);
		}
		const type = readStream.readUInt8('simpleTokenScheme.type');
		if (type !== SIMPLE_TOKEN_SCHEME_TYPE) {
			throw new Error(`Type mismatch in simpleTokenScheme ${type}`);
		}
		const mintedTokens = readStream.readUInt256('foundryOutput.mintedTokens');
		const meltedTokens = readStream.readUInt256('foundryOutput.meltedTokens');
		const maximumSupply = readStream.readUInt256('foundryOutput.maximumSupply');
		return {
			mintedTokens: util_js.HexHelper.fromBigInt256(mintedTokens),
			meltedTokens: util_js.HexHelper.fromBigInt256(meltedTokens),
			maximumSupply: util_js.HexHelper.fromBigInt256(maximumSupply),
			type: SIMPLE_TOKEN_SCHEME_TYPE
		};
	}
	/**
	 * Serialize the simple token scheme to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeSimpleTokenScheme(writeStream, object) {
		writeStream.writeUInt8('simpleTokenScheme.type', object.type);
		writeStream.writeUInt256('foundryOutput.mintedTokens', util_js.HexHelper.toBigInt256(object.mintedTokens));
		writeStream.writeUInt256('foundryOutput.meltedTokens', util_js.HexHelper.toBigInt256(object.meltedTokens));
		writeStream.writeUInt256('foundryOutput.maximumSupply', util_js.HexHelper.toBigInt256(object.maximumSupply));
	}

	/**
	 * The minimum length of a simple token scheme binary representation.
	 */
	const MIN_TOKEN_SCHEME_LENGTH = MIN_SIMPLE_TOKEN_SCHEME_LENGTH;
	/**
	 * Deserialize the token scheme from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeTokenScheme(readStream) {
		if (!readStream.hasRemaining(MIN_TOKEN_SCHEME_LENGTH)) {
			throw new Error(
				`Token Scheme data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_TOKEN_SCHEME_LENGTH}`
			);
		}
		const type = readStream.readUInt8('tokenScheme.type', false);
		let tokenScheme;
		if (type === SIMPLE_TOKEN_SCHEME_TYPE) {
			tokenScheme = deserializeSimpleTokenScheme(readStream);
		} else {
			throw new Error(`Unrecognized token scheme type ${type}`);
		}
		return tokenScheme;
	}
	/**
	 * Serialize the token scheme to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeTokenScheme(writeStream, object) {
		if (object.type === SIMPLE_TOKEN_SCHEME_TYPE) {
			serializeSimpleTokenScheme(writeStream, object);
		} else {
			throw new Error(`Unrecognized simple token scheme type ${object.type}`);
		}
	}

	/**
	 * The minimum length of a foundry output binary representation.
	 */
	const MIN_FOUNDRY_OUTPUT_LENGTH =
		SMALL_TYPE_LENGTH + // Type
		UINT64_SIZE + // Amount
		MIN_NATIVE_TOKENS_LENGTH + // Native tokens
		UINT32_SIZE + // Serial Number
		MIN_TOKEN_SCHEME_LENGTH + // Token scheme length
		MIN_UNLOCK_CONDITIONS_LENGTH + // Unlock conditions
		MIN_FEATURES_LENGTH + // Features
		MIN_FEATURES_LENGTH; // Immutable features
	/**
	 * Deserialize the foundry output from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeFoundryOutput(readStream) {
		if (!readStream.hasRemaining(MIN_FOUNDRY_OUTPUT_LENGTH)) {
			throw new Error(
				`Foundry Output data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_FOUNDRY_OUTPUT_LENGTH}`
			);
		}
		const type = readStream.readUInt8('foundryOutput.type');
		if (type !== FOUNDRY_OUTPUT_TYPE) {
			throw new Error(`Type mismatch in foundryOutput ${type}`);
		}
		const amount = readStream.readUInt64('foundryOutput.amount');
		const nativeTokens = deserializeNativeTokens(readStream);
		const serialNumber = readStream.readUInt32('foundryOutput.serialNumber');
		const tokenScheme = deserializeTokenScheme(readStream);
		const unlockConditions = deserializeUnlockConditions(readStream);
		const features = deserializeFeatures(readStream);
		const immutableFeatures = deserializeFeatures(readStream);
		return {
			type: FOUNDRY_OUTPUT_TYPE,
			amount: amount.toString(),
			nativeTokens,
			serialNumber,
			tokenScheme,
			unlockConditions,
			features: features,
			immutableFeatures
		};
	}
	/**
	 * Serialize the foundry output to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeFoundryOutput(writeStream, object) {
		writeStream.writeUInt8('foundryOutput.type', object.type);
		writeStream.writeUInt64('foundryOutput.amount', bigInt__default['default'](object.amount));
		serializeNativeTokens(writeStream, object.nativeTokens);
		writeStream.writeUInt32('foundryOutput.serialNumber', object.serialNumber);
		serializeTokenScheme(writeStream, object.tokenScheme);
		serializeUnlockConditions(writeStream, object.unlockConditions);
		serializeFeatures(writeStream, object.features);
		serializeFeatures(writeStream, object.immutableFeatures);
	}

	/**
	 * The minimum length of a nft output binary representation.
	 */
	const MIN_NFT_OUTPUT_LENGTH =
		SMALL_TYPE_LENGTH + // Type
		UINT64_SIZE + // Amount
		MIN_NATIVE_TOKENS_LENGTH + // Native tokens
		NFT_ID_LENGTH + // Nft Id
		MIN_UNLOCK_CONDITIONS_LENGTH + // Unlock conditions
		MIN_FEATURE_LENGTH + // Features
		MIN_FEATURE_LENGTH; // Immutable features
	/**
	 * Deserialize the nft output from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeNftOutput(readStream) {
		if (!readStream.hasRemaining(MIN_NFT_OUTPUT_LENGTH)) {
			throw new Error(
				`NFT Output data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_NFT_OUTPUT_LENGTH}`
			);
		}
		const type = readStream.readUInt8('nftOutput.type');
		if (type !== NFT_OUTPUT_TYPE) {
			throw new Error(`Type mismatch in nftOutput ${type}`);
		}
		const amount = readStream.readUInt64('nftOutput.amount');
		const nativeTokens = deserializeNativeTokens(readStream);
		const nftId = readStream.readFixedHex('nftOutput.nftId', NFT_ID_LENGTH);
		const unlockConditions = deserializeUnlockConditions(readStream);
		const features = deserializeFeatures(readStream);
		const immutableFeatures = deserializeFeatures(readStream);
		return {
			type: NFT_OUTPUT_TYPE,
			amount: amount.toString(),
			nativeTokens,
			nftId,
			unlockConditions,
			features,
			immutableFeatures
		};
	}
	/**
	 * Serialize the nft output to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeNftOutput(writeStream, object) {
		writeStream.writeUInt8('nftOutput.type', object.type);
		writeStream.writeUInt64('nftOutput.amount', bigInt__default['default'](object.amount));
		serializeNativeTokens(writeStream, object.nativeTokens);
		writeStream.writeFixedHex('nftOutput.nftId', NFT_ID_LENGTH, object.nftId);
		serializeUnlockConditions(writeStream, object.unlockConditions);
		serializeFeatures(writeStream, object.features);
		serializeFeatures(writeStream, object.immutableFeatures);
	}

	/**
	 * The minimum length of a treasury output binary representation.
	 */
	const MIN_TREASURY_OUTPUT_LENGTH =
		SMALL_TYPE_LENGTH + // Type
		UINT64_SIZE; // Amount
	/**
	 * Deserialize the treasury output from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeTreasuryOutput(readStream) {
		if (!readStream.hasRemaining(MIN_TREASURY_OUTPUT_LENGTH)) {
			throw new Error(
				`Treasury Output data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_TREASURY_OUTPUT_LENGTH}`
			);
		}
		const type = readStream.readUInt8('treasuryOutput.type');
		if (type !== TREASURY_OUTPUT_TYPE) {
			throw new Error(`Type mismatch in treasuryOutput ${type}`);
		}
		const amount = readStream.readUInt64('treasuryOutput.amount');
		return {
			type: TREASURY_OUTPUT_TYPE,
			amount: amount.toString()
		};
	}
	/**
	 * Serialize the treasury output to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeTreasuryOutput(writeStream, object) {
		writeStream.writeUInt8('treasuryOutput.type', object.type);
		writeStream.writeUInt64('treasuryOutput.amount', bigInt__default['default'](object.amount));
	}

	/**
	 * The minimum length of an output binary representation.
	 */
	const MIN_OUTPUT_LENGTH = Math.min(
		MIN_TREASURY_OUTPUT_LENGTH,
		MIN_FOUNDRY_OUTPUT_LENGTH,
		MIN_BASIC_OUTPUT_LENGTH,
		MIN_NFT_OUTPUT_LENGTH,
		MIN_ALIAS_OUTPUT_LENGTH
	);
	/**
	 * The minimum number of outputs.
	 */
	const MIN_OUTPUT_COUNT = 1;
	/**
	 * The maximum number of outputs.
	 */
	const MAX_OUTPUT_COUNT = 128;
	/**
	 * Deserialize the outputs from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeOutputs(readStream) {
		const numOutputs = readStream.readUInt16('outputs.numOutputs');
		const outputs = [];
		for (let i = 0; i < numOutputs; i++) {
			outputs.push(deserializeOutput(readStream));
		}
		return outputs;
	}
	/**
	 * Serialize the outputs to binary.
	 * @param writeStream The stream to write the data to.
	 * @param objects The objects to serialize.
	 */
	function serializeOutputs(writeStream, objects) {
		var _a, _b;
		if (objects.length < MIN_OUTPUT_COUNT) {
			throw new Error(
				`The minimum number of outputs is ${MIN_OUTPUT_COUNT}, you have provided ${objects.length}`
			);
		}
		if (objects.length > MAX_OUTPUT_COUNT) {
			throw new Error(
				`The maximum number of outputs is ${MAX_OUTPUT_COUNT}, you have provided ${objects.length}`
			);
		}
		writeStream.writeUInt16('outputs.numOutputs', objects.length);
		let nativeTokenCount = 0;
		for (let i = 0; i < objects.length; i++) {
			serializeOutput(writeStream, objects[i]);
			if (
				objects[i].type === BASIC_OUTPUT_TYPE ||
				objects[i].type === ALIAS_OUTPUT_TYPE ||
				objects[i].type === FOUNDRY_OUTPUT_TYPE ||
				objects[i].type === NFT_OUTPUT_TYPE
			) {
				const common = objects[i];
				nativeTokenCount +=
					(_b = (_a = common.nativeTokens) === null || _a === void 0 ? void 0 : _a.length) !== null &&
					_b !== void 0
						? _b
						: 0;
			}
		}
		if (nativeTokenCount > MAX_NATIVE_TOKEN_COUNT) {
			throw new Error(
				`The maximum number of native tokens is ${MAX_NATIVE_TOKEN_COUNT}, you have provided ${nativeTokenCount}`
			);
		}
	}
	/**
	 * Deserialize the output from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeOutput(readStream) {
		if (!readStream.hasRemaining(MIN_OUTPUT_LENGTH)) {
			throw new Error(
				`Output data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_OUTPUT_LENGTH}`
			);
		}
		const type = readStream.readUInt8('output.type', false);
		let output;
		if (type === TREASURY_OUTPUT_TYPE) {
			output = deserializeTreasuryOutput(readStream);
		} else if (type === BASIC_OUTPUT_TYPE) {
			output = deserializeBasicOutput(readStream);
		} else if (type === FOUNDRY_OUTPUT_TYPE) {
			output = deserializeFoundryOutput(readStream);
		} else if (type === NFT_OUTPUT_TYPE) {
			output = deserializeNftOutput(readStream);
		} else if (type === ALIAS_OUTPUT_TYPE) {
			output = deserializeAliasOutput(readStream);
		} else {
			throw new Error(`Unrecognized output type ${type}`);
		}
		return output;
	}
	/**
	 * Serialize the output to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeOutput(writeStream, object) {
		if (object.type === TREASURY_OUTPUT_TYPE) {
			serializeTreasuryOutput(writeStream, object);
		} else if (object.type === BASIC_OUTPUT_TYPE) {
			serializeBasicOutput(writeStream, object);
		} else if (object.type === FOUNDRY_OUTPUT_TYPE) {
			serializeFoundryOutput(writeStream, object);
		} else if (object.type === NFT_OUTPUT_TYPE) {
			serializeNftOutput(writeStream, object);
		} else if (object.type === ALIAS_OUTPUT_TYPE) {
			serializeAliasOutput(writeStream, object);
		} else {
			throw new Error(`Unrecognized output type ${object.type}`);
		}
	}

	/**
	 * The minimum length of a transaction essence binary representation.
	 */
	const MIN_TRANSACTION_ESSENCE_LENGTH =
		SMALL_TYPE_LENGTH + // type
		UINT64_SIZE + // network id
		ARRAY_LENGTH + // input count
		INPUTS_COMMITMENT_SIZE + // input commitments
		ARRAY_LENGTH + // output count
		UINT32_SIZE; // payload type
	/**
	 * Deserialize the transaction essence from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeTransactionEssence(readStream) {
		if (!readStream.hasRemaining(MIN_TRANSACTION_ESSENCE_LENGTH)) {
			throw new Error(
				`Transaction essence data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_TRANSACTION_ESSENCE_LENGTH}`
			);
		}
		const type = readStream.readUInt8('transactionEssence.type');
		if (type !== TRANSACTION_ESSENCE_TYPE) {
			throw new Error(`Type mismatch in transactionEssence ${type}`);
		}
		const networkId = readStream.readUInt64('transactionEssence.networkId');
		const inputs = deserializeInputs(readStream);
		const inputsCommitment = readStream.readFixedHex('transactionEssence.inputsCommitment', INPUTS_COMMITMENT_SIZE);
		const outputs = deserializeOutputs(readStream);
		const payload = deserializePayload(readStream);
		if (payload && payload.type !== TAGGED_DATA_PAYLOAD_TYPE) {
			throw new Error('Transaction essence can only contain embedded Tagged Data Payload');
		}
		for (const input of inputs) {
			if (input.type !== UTXO_INPUT_TYPE) {
				throw new Error('Transaction essence can only contain UTXO Inputs');
			}
		}
		return {
			type: TRANSACTION_ESSENCE_TYPE,
			networkId: networkId.toString(),
			inputs: inputs,
			inputsCommitment,
			outputs,
			payload
		};
	}
	/**
	 * Serialize the transaction essence to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeTransactionEssence(writeStream, object) {
		var _a;
		writeStream.writeUInt8('transactionEssence.type', object.type);
		writeStream.writeUInt64(
			'transactionEssence.networkId',
			bigInt__default['default']((_a = object.networkId) !== null && _a !== void 0 ? _a : '0')
		);
		for (const input of object.inputs) {
			if (input.type !== UTXO_INPUT_TYPE) {
				throw new Error('Transaction essence can only contain UTXO Inputs');
			}
		}
		serializeInputs(writeStream, object.inputs);
		writeStream.writeFixedHex(
			'transactionEssence.inputsCommitment',
			INPUTS_COMMITMENT_SIZE,
			object.inputsCommitment
		);
		serializeOutputs(writeStream, object.outputs);
		serializePayload(writeStream, object.payload);
	}

	/**
	 * The global type for the alias unlock.
	 */
	const ALIAS_UNLOCK_TYPE = 2;

	/**
	 * The global type for the NFT unlock.
	 */
	const NFT_UNLOCK_TYPE = 3;

	/**
	 * The global type for the reference unlock.
	 */
	const REFERENCE_UNLOCK_TYPE = 1;

	/**
	 * The global type for the unlock.
	 */
	const SIGNATURE_UNLOCK_TYPE = 0;

	/**
	 * The minimum length of a alias unlock binary representation.
	 */
	const MIN_ALIAS_UNLOCK_LENGTH = SMALL_TYPE_LENGTH + UINT16_SIZE;
	/**
	 * Deserialize the alias unlock from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeAliasUnlock(readStream) {
		if (!readStream.hasRemaining(MIN_ALIAS_UNLOCK_LENGTH)) {
			throw new Error(
				`Alias Unlock data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_ALIAS_UNLOCK_LENGTH}`
			);
		}
		const type = readStream.readUInt8('aliasUnlock.type');
		if (type !== ALIAS_UNLOCK_TYPE) {
			throw new Error(`Type mismatch in aliasUnlock ${type}`);
		}
		const reference = readStream.readUInt16('aliasUnlock.reference');
		return {
			type: ALIAS_UNLOCK_TYPE,
			reference
		};
	}
	/**
	 * Serialize the alias unlock to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeAliasUnlock(writeStream, object) {
		writeStream.writeUInt8('aliasUnlock.type', object.type);
		writeStream.writeUInt16('aliasUnlock.reference', object.reference);
	}

	/**
	 * The minimum length of a nft unlock binary representation.
	 */
	const MIN_NFT_UNLOCK_LENGTH = SMALL_TYPE_LENGTH + UINT16_SIZE;
	/**
	 * Deserialize the nft unlock from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeNftUnlock(readStream) {
		if (!readStream.hasRemaining(MIN_NFT_UNLOCK_LENGTH)) {
			throw new Error(
				`Nft Unlock data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_NFT_UNLOCK_LENGTH}`
			);
		}
		const type = readStream.readUInt8('nftUnlock.type');
		if (type !== NFT_UNLOCK_TYPE) {
			throw new Error(`Type mismatch in nftUnlock ${type}`);
		}
		const reference = readStream.readUInt16('nftUnlock.reference');
		return {
			type: NFT_UNLOCK_TYPE,
			reference
		};
	}
	/**
	 * Serialize the nft unlock to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeNftUnlock(writeStream, object) {
		writeStream.writeUInt8('nftUnlock.type', object.type);
		writeStream.writeUInt16('nftUnlock.reference', object.reference);
	}

	/**
	 * The minimum length of a reference unlock binary representation.
	 */
	const MIN_REFERENCE_UNLOCK_LENGTH = SMALL_TYPE_LENGTH + UINT16_SIZE;
	/**
	 * Deserialize the reference unlock from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeReferenceUnlock(readStream) {
		if (!readStream.hasRemaining(MIN_REFERENCE_UNLOCK_LENGTH)) {
			throw new Error(
				`Reference Unlock data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_REFERENCE_UNLOCK_LENGTH}`
			);
		}
		const type = readStream.readUInt8('referenceUnlock.type');
		if (type !== REFERENCE_UNLOCK_TYPE) {
			throw new Error(`Type mismatch in referenceUnlock ${type}`);
		}
		const reference = readStream.readUInt16('referenceUnlock.reference');
		return {
			type: REFERENCE_UNLOCK_TYPE,
			reference
		};
	}
	/**
	 * Serialize the reference unlock to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeReferenceUnlock(writeStream, object) {
		writeStream.writeUInt8('referenceUnlock.type', object.type);
		writeStream.writeUInt16('referenceUnlock.reference', object.reference);
	}

	/**
	 * The minimum length of a signature unlock binary representation.
	 */
	const MIN_SIGNATURE_UNLOCK_LENGTH = SMALL_TYPE_LENGTH + MIN_SIGNATURE_LENGTH;
	/**
	 * Deserialize the signature unlock from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeSignatureUnlock(readStream) {
		if (!readStream.hasRemaining(MIN_SIGNATURE_UNLOCK_LENGTH)) {
			throw new Error(
				`Signature Unlock data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_SIGNATURE_UNLOCK_LENGTH}`
			);
		}
		const type = readStream.readUInt8('signatureUnlock.type');
		if (type !== SIGNATURE_UNLOCK_TYPE) {
			throw new Error(`Type mismatch in signatureUnlock ${type}`);
		}
		const signature = deserializeSignature(readStream);
		return {
			type: SIGNATURE_UNLOCK_TYPE,
			signature
		};
	}
	/**
	 * Serialize the signature unlock to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeSignatureUnlock(writeStream, object) {
		writeStream.writeUInt8('signatureUnlock.type', object.type);
		serializeSignature(writeStream, object.signature);
	}

	/**
	 * The minimum length of an unlock binary representation.
	 */
	const MIN_UNLOCK_LENGTH = Math.min(
		MIN_SIGNATURE_UNLOCK_LENGTH,
		MIN_REFERENCE_UNLOCK_LENGTH,
		MIN_ALIAS_UNLOCK_LENGTH,
		MIN_NFT_UNLOCK_LENGTH
	);
	/**
	 * Deserialize the unlocks from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeUnlocks(readStream) {
		const numUnlocks = readStream.readUInt16('transactionEssence.numUnlocks');
		const unlocks = [];
		for (let i = 0; i < numUnlocks; i++) {
			unlocks.push(deserializeUnlock(readStream));
		}
		return unlocks;
	}
	/**
	 * Serialize the unlocks to binary.
	 * @param writeStream The stream to write the data to.
	 * @param objects The objects to serialize.
	 */
	function serializeUnlocks(writeStream, objects) {
		writeStream.writeUInt16('transactionEssence.numUnlocks', objects.length);
		for (let i = 0; i < objects.length; i++) {
			serializeUnlock(writeStream, objects[i]);
		}
	}
	/**
	 * Deserialize the unlock from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeUnlock(readStream) {
		if (!readStream.hasRemaining(MIN_UNLOCK_LENGTH)) {
			throw new Error(
				`Unlock data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_UNLOCK_LENGTH}`
			);
		}
		const type = readStream.readUInt8('unlock.type', false);
		let unlock;
		if (type === SIGNATURE_UNLOCK_TYPE) {
			unlock = deserializeSignatureUnlock(readStream);
		} else if (type === REFERENCE_UNLOCK_TYPE) {
			unlock = deserializeReferenceUnlock(readStream);
		} else if (type === ALIAS_UNLOCK_TYPE) {
			unlock = deserializeAliasUnlock(readStream);
		} else if (type === NFT_UNLOCK_TYPE) {
			unlock = deserializeNftUnlock(readStream);
		} else {
			throw new Error(`Unrecognized unlock type ${type}`);
		}
		return unlock;
	}
	/**
	 * Serialize the unlock to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeUnlock(writeStream, object) {
		if (object.type === SIGNATURE_UNLOCK_TYPE) {
			serializeSignatureUnlock(writeStream, object);
		} else if (object.type === REFERENCE_UNLOCK_TYPE) {
			serializeReferenceUnlock(writeStream, object);
		} else if (object.type === ALIAS_UNLOCK_TYPE) {
			serializeAliasUnlock(writeStream, object);
		} else if (object.type === NFT_UNLOCK_TYPE) {
			serializeNftUnlock(writeStream, object);
		} else {
			throw new Error(`Unrecognized unlock type ${object.type}`);
		}
	}

	/**
	 * The minimum length of a transaction payload binary representation.
	 */
	const MIN_TRANSACTION_PAYLOAD_LENGTH =
		TYPE_LENGTH + // min payload
		UINT32_SIZE; // essence type
	/**
	 * Deserialize the transaction payload from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeTransactionPayload(readStream) {
		if (!readStream.hasRemaining(MIN_TRANSACTION_PAYLOAD_LENGTH)) {
			throw new Error(
				`Transaction Payload data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_TRANSACTION_PAYLOAD_LENGTH}`
			);
		}
		const type = readStream.readUInt32('payloadTransaction.type');
		if (type !== TRANSACTION_PAYLOAD_TYPE) {
			throw new Error(`Type mismatch in payloadTransaction ${type}`);
		}
		const essenceType = readStream.readUInt8('payloadTransaction.essenceType', false);
		let essence;
		let unlocks;
		if (essenceType === TRANSACTION_ESSENCE_TYPE) {
			essence = deserializeTransactionEssence(readStream);
			unlocks = deserializeUnlocks(readStream);
		} else {
			throw new Error(`Unrecognized transaction essence type ${type}`);
		}
		return {
			type: TRANSACTION_PAYLOAD_TYPE,
			essence,
			unlocks
		};
	}
	/**
	 * Serialize the transaction payload to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeTransactionPayload(writeStream, object) {
		writeStream.writeUInt32('payloadTransaction.type', object.type);
		if (object.type === TRANSACTION_PAYLOAD_TYPE) {
			serializeTransactionEssence(writeStream, object.essence);
			serializeUnlocks(writeStream, object.unlocks);
		} else {
			throw new Error(`Unrecognized transaction type ${object.type}`);
		}
	}

	/**
	 * The minimum length of a treasury transaction payload binary representation.
	 */
	const MIN_TREASURY_TRANSACTION_PAYLOAD_LENGTH =
		TYPE_LENGTH + MIN_TREASURY_INPUT_LENGTH + MIN_TREASURY_OUTPUT_LENGTH;
	/**
	 * Deserialize the treasury transaction payload from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializeTreasuryTransactionPayload(readStream) {
		if (!readStream.hasRemaining(MIN_TREASURY_TRANSACTION_PAYLOAD_LENGTH)) {
			throw new Error(
				`Treasury Transaction Payload data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_TREASURY_TRANSACTION_PAYLOAD_LENGTH}`
			);
		}
		const type = readStream.readUInt32('payloadTreasuryTransaction.type');
		if (type !== TREASURY_TRANSACTION_PAYLOAD_TYPE) {
			throw new Error(`Type mismatch in payloadTreasuryTransaction ${type}`);
		}
		const input = deserializeTreasuryInput(readStream);
		const output = deserializeTreasuryOutput(readStream);
		return {
			type: TREASURY_TRANSACTION_PAYLOAD_TYPE,
			input,
			output
		};
	}
	/**
	 * Serialize the treasury transaction payload to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeTreasuryTransactionPayload(writeStream, object) {
		writeStream.writeUInt32('payloadTreasuryTransaction.type', object.type);
		serializeTreasuryInput(writeStream, object.input);
		serializeTreasuryOutput(writeStream, object.output);
	}

	/**
	 * The minimum length of a payload binary representation.
	 */
	const MIN_PAYLOAD_LENGTH = Math.min(
		MIN_TRANSACTION_PAYLOAD_LENGTH,
		MIN_MILESTONE_PAYLOAD_LENGTH,
		MIN_TAGGED_DATA_PAYLOAD_LENGTH,
		MIN_TREASURY_TRANSACTION_PAYLOAD_LENGTH
	);
	/**
	 * Deserialize the payload from binary.
	 * @param readStream The stream to read the data from.
	 * @returns The deserialized object.
	 */
	function deserializePayload(readStream) {
		const payloadLength = readStream.readUInt32('payload.length');
		if (!readStream.hasRemaining(payloadLength)) {
			throw new Error(`Payload length ${payloadLength} exceeds the remaining data ${readStream.unused()}`);
		}
		let payload;
		if (payloadLength > 0) {
			const payloadType = readStream.readUInt32('payload.type', false);
			if (payloadType === TRANSACTION_PAYLOAD_TYPE) {
				payload = deserializeTransactionPayload(readStream);
			} else if (payloadType === MILESTONE_PAYLOAD_TYPE) {
				payload = deserializeMilestonePayload(readStream);
			} else if (payloadType === TREASURY_TRANSACTION_PAYLOAD_TYPE) {
				payload = deserializeTreasuryTransactionPayload(readStream);
			} else if (payloadType === TAGGED_DATA_PAYLOAD_TYPE) {
				payload = deserializeTaggedDataPayload(readStream);
			} else {
				throw new Error(`Unrecognized payload type ${payloadType}`);
			}
		}
		return payload;
	}
	/**
	 * Serialize the payload essence to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializePayload(writeStream, object) {
		// Store the location for the payload length and write 0
		// we will rewind and fill in once the size of the payload is known
		const payloadLengthWriteIndex = writeStream.getWriteIndex();
		writeStream.writeUInt32('payload.length', 0);
		if (!object);
		else if (object.type === TRANSACTION_PAYLOAD_TYPE) {
			serializeTransactionPayload(writeStream, object);
		} else if (object.type === MILESTONE_PAYLOAD_TYPE) {
			serializeMilestonePayload(writeStream, object);
		} else if (object.type === TREASURY_TRANSACTION_PAYLOAD_TYPE) {
			serializeTreasuryTransactionPayload(writeStream, object);
		} else if (object.type === TAGGED_DATA_PAYLOAD_TYPE) {
			serializeTaggedDataPayload(writeStream, object);
		} else {
			throw new Error(`Unrecognized transaction type ${object.type}`);
		}
		const endOfPayloadWriteIndex = writeStream.getWriteIndex();
		writeStream.setWriteIndex(payloadLengthWriteIndex);
		writeStream.writeUInt32('payload.length', endOfPayloadWriteIndex - payloadLengthWriteIndex - UINT32_SIZE);
		writeStream.setWriteIndex(endOfPayloadWriteIndex);
	}

	/**
	 * The minimum length of a block binary representation.
	 */
	const MIN_BLOCK_LENGTH =
		UINT8_SIZE + // Protocol Version
		UINT8_SIZE + // Parent count
		BLOCK_ID_LENGTH + // Single parent
		MIN_PAYLOAD_LENGTH + // Min payload length
		UINT64_SIZE; // Nonce
	/**
	 * The maximum length of a block.
	 */
	const MAX_BLOCK_LENGTH = 32768;
	/**
	 * The maximum number of parents.
	 */
	const MAX_NUMBER_PARENTS = 8;
	/**
	 * The minimum number of parents.
	 */
	const MIN_NUMBER_PARENTS = 1;
	/**
	 * Deserialize the block from binary.
	 * @param readStream The block to deserialize.
	 * @returns The deserialized block.
	 */
	function deserializeBlock(readStream) {
		if (!readStream.hasRemaining(MIN_BLOCK_LENGTH)) {
			throw new Error(
				`Block data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_BLOCK_LENGTH}`
			);
		}
		const protocolVersion = readStream.readUInt8('block.protocolVersion');
		const numParents = readStream.readUInt8('block.numParents');
		const parents = [];
		for (let i = 0; i < numParents; i++) {
			const parentBlockId = readStream.readFixedHex(`block.parentBlockId${i}`, BLOCK_ID_LENGTH);
			parents.push(parentBlockId);
		}
		const payload = deserializePayload(readStream);
		if (payload && payload.type === TREASURY_TRANSACTION_PAYLOAD_TYPE) {
			throw new Error('Blocks can not contain receipt or treasury transaction payloads');
		}
		const nonce = readStream.readUInt64('block.nonce');
		const unused = readStream.unused();
		if (unused !== 0) {
			throw new Error(`Block data length ${readStream.length()} has unused data ${unused}`);
		}
		return {
			protocolVersion,
			parents,
			payload,
			nonce: nonce.toString()
		};
	}
	/**
	 * Serialize the block essence to binary.
	 * @param writeStream The stream to write the data to.
	 * @param object The object to serialize.
	 */
	function serializeBlock(writeStream, object) {
		var _a, _b, _c, _d;
		writeStream.writeUInt8(
			'block.protocolVersion',
			(_a = object.protocolVersion) !== null && _a !== void 0 ? _a : DEFAULT_PROTOCOL_VERSION
		);
		const numParents =
			(_c = (_b = object.parents) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0
				? _c
				: 0;
		writeStream.writeUInt8('block.numParents', numParents);
		if (object.parents) {
			if (numParents > MAX_NUMBER_PARENTS) {
				throw new Error(`A maximum of ${MAX_NUMBER_PARENTS} parents is allowed, you provided ${numParents}`);
			}
			if (new Set(object.parents).size !== numParents) {
				throw new Error('The block parents must be unique');
			}
			const sorted = object.parents.slice().sort();
			for (let i = 0; i < numParents; i++) {
				if (sorted[i] !== object.parents[i]) {
					throw new Error('The block parents must be lexographically sorted');
				}
				writeStream.writeFixedHex(`block.parentBlockId${i + 1}`, BLOCK_ID_LENGTH, object.parents[i]);
			}
		}
		if (
			object.payload &&
			object.payload.type !== TRANSACTION_PAYLOAD_TYPE &&
			object.payload.type !== MILESTONE_PAYLOAD_TYPE &&
			object.payload.type !== TAGGED_DATA_PAYLOAD_TYPE
		) {
			throw new Error('Blocks can only contain transaction, milestone or tagged data payloads');
		}
		serializePayload(writeStream, object.payload);
		writeStream.writeUInt64(
			'block.nonce',
			bigInt__default['default']((_d = object.nonce) !== null && _d !== void 0 ? _d : '0')
		);
	}

	// Copyright 2020 IOTA Stiftung
	// SPDX-License-Identifier: Apache-2.0
	/**
	 * Class to represent errors from Client.
	 */
	class ClientError extends Error {
		/**
		 * Create a new instance of ClientError.
		 * @param message The message for the error.
		 * @param route The route the request was made to.
		 * @param httpStatus The http status code.
		 * @param code The code in the payload.
		 */
		constructor(message, route, httpStatus, code) {
			super(message);
			this.route = route;
			this.httpStatus = httpStatus;
			this.code = code;
		}
	}

	// Copyright 2020 IOTA Stiftung
	/**
	 * Client for API communication.
	 */
	class SingleNodeClient {
		/**
		 * Create a new instance of client.
		 * @param endpoint The endpoint.
		 * @param options Options for the client.
		 */
		constructor(endpoint, options) {
			var _a, _b, _c, _d;
			if (!endpoint) {
				throw new Error('The endpoint can not be empty');
			}
			this._endpoint = endpoint.replace(/\/+$/, '');
			this._basePath =
				(_a = options === null || options === void 0 ? void 0 : options.basePath) !== null && _a !== void 0
					? _a
					: '/api/';
			this._coreApiPath = `${this._basePath}core/v2/`;
			this._powProvider = options === null || options === void 0 ? void 0 : options.powProvider;
			this._timeout = options === null || options === void 0 ? void 0 : options.timeout;
			this._userName = options === null || options === void 0 ? void 0 : options.userName;
			this._password = options === null || options === void 0 ? void 0 : options.password;
			this._headers = options === null || options === void 0 ? void 0 : options.headers;
			this._protocolVersion =
				(_b = options === null || options === void 0 ? void 0 : options.protocolVersion) !== null &&
				_b !== void 0
					? _b
					: DEFAULT_PROTOCOL_VERSION;
			if (this._userName && this._password && !this._endpoint.startsWith('https')) {
				throw new Error('Basic authentication requires the endpoint to be https');
			}
			if (
				this._userName &&
				this._password &&
				(((_c = this._headers) === null || _c === void 0 ? void 0 : _c.authorization) ||
					((_d = this._headers) === null || _d === void 0 ? void 0 : _d.Authorization))
			) {
				throw new Error('You can not supply both user/pass and authorization header');
			}
		}
		/**
		 * Get the health of the node.
		 * @returns True if the node is healthy.
		 */
		async health() {
			const status = await this.fetchStatus('/health');
			if (status === 200) {
				return true;
			} else if (status === 503) {
				return false;
			}
			throw new ClientError('Unexpected response code', '/health', status);
		}
		/**
		 * Get the routes the node exposes.
		 * @returns The routes.
		 */
		async routes() {
			return this.fetchJson(this._basePath, 'get', 'routes');
		}
		/**
		 * Get the info about the node.
		 * @returns The node information.
		 */
		async info() {
			return this.fetchJson(this._coreApiPath, 'get', 'info');
		}
		/**
		 * Get the tips from the node.
		 * @returns The tips.
		 */
		async tips() {
			return this.fetchJson(this._coreApiPath, 'get', 'tips');
		}
		/**
		 * Get the block data by id.
		 * @param blockId The block to get the data for.
		 * @returns The block data.
		 */
		async block(blockId) {
			return this.fetchJson(this._coreApiPath, 'get', `blocks/${blockId}`);
		}
		/**
		 * Get the block metadata by id.
		 * @param blockId The block to get the metadata for.
		 * @returns The block metadata.
		 */
		async blockMetadata(blockId) {
			return this.fetchJson(this._coreApiPath, 'get', `blocks/${blockId}/metadata`);
		}
		/**
		 * Get the block raw data by id.
		 * @param blockId The block to get the data for.
		 * @returns The block raw data.
		 */
		async blockRaw(blockId) {
			return this.fetchBinary(this._coreApiPath, 'get', `blocks/${blockId}`);
		}
		/**
		 * Submit block.
		 * @param blockPartial The block to submit (possibly contains only partial block data).
		 * @param blockPartial.protocolVersion The protocol version under which this block operates.
		 * @param blockPartial.parents The parent block ids.
		 * @param blockPartial.payload The payload contents.
		 * @param blockPartial.nonce The nonce for the block.
		 * @returns The blockId.
		 */
		async blockSubmit(blockPartial) {
			var _a, _b, _c, _d, _e;
			blockPartial.protocolVersion = this._protocolVersion;
			let minPowScore = 0;
			if (this._powProvider) {
				// If there is a local pow provider and no networkId or parent block ids
				// we must populate them, so that the they are not filled in by the
				// node causing invalid pow calculation
				if (this._protocol === undefined) {
					await this.populateProtocolInfoCache();
				}
				minPowScore =
					(_b = (_a = this._protocol) === null || _a === void 0 ? void 0 : _a.minPowScore) !== null &&
					_b !== void 0
						? _b
						: 0;
				if (!blockPartial.parents || blockPartial.parents.length === 0) {
					const tips = await this.tips();
					blockPartial.parents = tips.tips;
				}
			}
			const block = {
				protocolVersion:
					(_c = blockPartial.protocolVersion) !== null && _c !== void 0 ? _c : DEFAULT_PROTOCOL_VERSION,
				parents: (_d = blockPartial.parents) !== null && _d !== void 0 ? _d : [],
				payload: blockPartial.payload,
				nonce: (_e = blockPartial.nonce) !== null && _e !== void 0 ? _e : '0'
			};
			const writeStream = new util_js.WriteStream();
			serializeBlock(writeStream, block);
			const blockBytes = writeStream.finalBytes();
			if (blockBytes.length > MAX_BLOCK_LENGTH) {
				throw new Error(
					`The block length is ${blockBytes.length}, which exceeds the maximum size of ${MAX_BLOCK_LENGTH}`
				);
			}
			if (this._powProvider) {
				const nonce = await this._powProvider.pow(blockBytes, minPowScore);
				block.nonce = nonce.toString();
			}
			const response = await this.fetchJson(this._coreApiPath, 'post', 'blocks', block);
			return response.blockId;
		}
		/**
		 * Submit block in raw format.
		 * @param block The block to submit.
		 * @returns The blockId.
		 */
		async blockSubmitRaw(block) {
			var _a, _b;
			if (block.length > MAX_BLOCK_LENGTH) {
				throw new Error(
					`The block length is ${block.length}, which exceeds the maximum size of ${MAX_BLOCK_LENGTH}`
				);
			}
			block[0] = this._protocolVersion;
			if (this._powProvider && crypto_js.ArrayHelper.equal(block.slice(-8), SingleNodeClient.NONCE_ZERO)) {
				if (this._protocol === undefined) {
					await this.populateProtocolInfoCache();
				}
				const nonce = await this._powProvider.pow(
					block,
					(_b = (_a = this._protocol) === null || _a === void 0 ? void 0 : _a.minPowScore) !== null &&
						_b !== void 0
						? _b
						: 0
				);
				util_js.BigIntHelper.write8(bigInt__default['default'](nonce), block, block.length - 8);
			}
			const response = await this.fetchBinary(this._coreApiPath, 'post', 'blocks', block);
			return response.blockId;
		}
		/**
		 * Get the block that was included in the ledger for a transaction.
		 * @param transactionId The id of the transaction to get the included block for.
		 * @returns The block.
		 */
		async transactionIncludedBlock(transactionId) {
			return this.fetchJson(this._coreApiPath, 'get', `transactions/${transactionId}/included-block`);
		}
		/**
		 * Get raw block that was included in the ledger for a transaction.
		 * @param transactionId The id of the transaction to get the included block for.
		 * @returns The block.
		 */
		async transactionIncludedBlockRaw(transactionId) {
			return this.fetchBinary(this._coreApiPath, 'get', `transactions/${transactionId}/included-block`);
		}
		/**
		 * Get an output by its identifier.
		 * @param outputId The id of the output to get.
		 * @returns The output details.
		 */
		async output(outputId) {
			return this.fetchJson(this._coreApiPath, 'get', `outputs/${outputId}`);
		}
		/**
		 * Get an outputs metadata by its identifier.
		 * @param outputId The id of the output to get the metadata for.
		 * @returns The output metadata.
		 */
		async outputMetadata(outputId) {
			return this.fetchJson(this._coreApiPath, 'get', `outputs/${outputId}/metadata`);
		}
		/**
		 * Get an outputs raw data.
		 * @param outputId The id of the output to get the raw data for.
		 * @returns The output raw bytes.
		 */
		async outputRaw(outputId) {
			return this.fetchBinary(this._coreApiPath, 'get', `outputs/${outputId}`);
		}
		/**
		 * Get the requested milestone.
		 * @param index The index of the milestone to look up.
		 * @returns The milestone payload.
		 */
		async milestoneByIndex(index) {
			return this.fetchJson(this._coreApiPath, 'get', `milestones/by-index/${index}`);
		}
		/**
		 * Get the requested milestone raw.
		 * @param index The index of the milestone to look up.
		 * @returns The milestone payload raw.
		 */
		async milestoneByIndexRaw(index) {
			return this.fetchBinary(this._coreApiPath, 'get', `milestones/by-index/${index}`);
		}
		/**
		 * Get the requested milestone utxo changes.
		 * @param index The index of the milestone to request the changes for.
		 * @returns The milestone utxo changes details.
		 */
		async milestoneUtxoChangesByIndex(index) {
			return this.fetchJson(this._coreApiPath, 'get', `milestones/by-index/${index}/utxo-changes`);
		}
		/**
		 * Get the requested milestone.
		 * @param milestoneId The id of the milestone to look up.
		 * @returns The milestone payload.
		 */
		async milestoneById(milestoneId) {
			return this.fetchJson(this._coreApiPath, 'get', `milestones/${milestoneId}`);
		}
		/**
		 * Get the requested milestone raw.
		 * @param milestoneId The id of the milestone to look up.
		 * @returns The milestone payload raw.
		 */
		async milestoneByIdRaw(milestoneId) {
			return this.fetchBinary(this._coreApiPath, 'get', `milestones/${milestoneId}`);
		}
		/**
		 * Get the requested milestone utxo changes.
		 * @param milestoneId The id of the milestone to request the changes for.
		 * @returns The milestone utxo changes details.
		 */
		async milestoneUtxoChangesById(milestoneId) {
			return this.fetchJson(this._coreApiPath, 'get', `milestones/${milestoneId}/utxo-changes`);
		}
		/**
		 * Get the current treasury output.
		 * @returns The details for the treasury.
		 */
		async treasury() {
			return this.fetchJson(this._coreApiPath, 'get', 'treasury');
		}
		/**
		 * Get all the stored receipts or those for a given migrated at index.
		 * @param migratedAt The index the receipts were migrated at, if not supplied returns all stored receipts.
		 * @returns The stored receipts.
		 */
		async receipts(migratedAt) {
			return this.fetchJson(
				this._coreApiPath,
				'get',
				`receipts${migratedAt !== undefined ? `/${migratedAt}` : ''}`
			);
		}
		/**
		 * Get the list of peers.
		 * @returns The list of peers.
		 */
		async peers() {
			return this.fetchJson(this._coreApiPath, 'get', 'peers');
		}
		/**
		 * Add a new peer.
		 * @param multiAddress The address of the peer to add.
		 * @param alias An optional alias for the peer.
		 * @returns The details for the created peer.
		 */
		async peerAdd(multiAddress, alias) {
			return this.fetchJson(this._coreApiPath, 'post', 'peers', {
				multiAddress,
				alias
			});
		}
		/**
		 * Delete a peer.
		 * @param peerId The peer to delete.
		 * @returns Nothing.
		 */
		async peerDelete(peerId) {
			// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
			return this.fetchJson(this._coreApiPath, 'delete', `peers/${peerId}`);
		}
		/**
		 * Get a peer.
		 * @param peerId The peer to delete.
		 * @returns The details for the created peer.
		 */
		async peer(peerId) {
			return this.fetchJson(this._coreApiPath, 'get', `peers/${peerId}`);
		}
		/**
		 * Get the protocol info from the node.
		 * @returns The protocol info.
		 */
		async protocolInfo() {
			if (this._protocol === undefined) {
				await this.populateProtocolInfoCache();
			}
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return this._protocol;
		}
		/**
		 * Extension method which provides request methods for plugins.
		 * @param basePluginPath The base path for the plugin eg indexer/v1/ .
		 * @param method The http method.
		 * @param methodPath The path for the plugin request.
		 * @param queryParams Additional query params for the request.
		 * @param request The request object.
		 * @returns The response object.
		 */
		async pluginFetch(basePluginPath, method, methodPath, queryParams, request) {
			return this.fetchJson(
				this._basePath,
				method,
				`${basePluginPath}${methodPath}${this.combineQueryParams(queryParams)}`,
				request
			);
		}
		/**
		 * Perform a request and just return the status.
		 * @param route The route of the request.
		 * @returns The response.
		 * @internal
		 */
		async fetchStatus(route) {
			const response = await this.fetchWithTimeout('get', route);
			return response.status;
		}
		/**
		 * Populate the info cached fields.
		 * @internal
		 */
		async populateProtocolInfoCache() {
			if (this._protocol === undefined) {
				const info = await this.info();
				const networkIdBytes = crypto_js.Blake2b.sum256(
					util_js.Converter.utf8ToBytes(info.protocol.networkName)
				);
				this._protocol = {
					networkName: info.protocol.networkName,
					networkId: util_js.BigIntHelper.read8(networkIdBytes, 0).toString(),
					bech32Hrp: info.protocol.bech32Hrp,
					minPowScore: info.protocol.minPowScore
				};
			}
		}
		/**
		 * Perform a request in json format.
		 * @param basePath The base path for the request.
		 * @param method The http method.
		 * @param route The route of the request.
		 * @param requestData Request to send to the endpoint.
		 * @returns The response.
		 * @internal
		 */
		async fetchJson(basePath, method, route, requestData) {
			const response = await this.fetchWithTimeout(
				method,
				`${basePath}${route}`,
				{ 'Content-Type': 'application/json' },
				requestData ? JSON.stringify(requestData) : undefined
			);
			let errorMessage;
			let errorCode;
			if (response.ok) {
				if (response.status === 204) {
					// No content
					return {};
				}
				try {
					const responseData = await response.json();
					if (responseData.error) {
						errorMessage = responseData.error.message;
						errorCode = responseData.error.code;
					} else {
						return responseData;
					}
				} catch {}
			}
			if (!errorMessage) {
				try {
					const json = await response.json();
					if (json.error) {
						errorMessage = json.error.message;
						errorCode = json.error.code;
					}
				} catch {}
			}
			if (!errorMessage) {
				try {
					const text = await response.text();
					if (text.length > 0) {
						const match = /code=(\d+), message=(.*)/.exec(text);
						if ((match === null || match === void 0 ? void 0 : match.length) === 3) {
							errorCode = match[1];
							errorMessage = match[2];
						} else {
							errorMessage = text;
						}
					}
				} catch {}
			}
			throw new ClientError(
				errorMessage !== null && errorMessage !== void 0 ? errorMessage : response.statusText,
				route,
				response.status,
				errorCode !== null && errorCode !== void 0 ? errorCode : response.status.toString()
			);
		}
		/**
		 * Perform a request for binary data.
		 * @param basePath The base path for the request.
		 * @param method The http method.
		 * @param route The route of the request.
		 * @param requestData Request to send to the endpoint.
		 * @returns The response.
		 * @internal
		 */
		async fetchBinary(basePath, method, route, requestData) {
			var _a, _b, _c;
			const response = await this.fetchWithTimeout(
				method,
				`${basePath}${route}`,
				{ Accept: 'application/vnd.iota.serializer-v1' },
				requestData
			);
			let responseData;
			if (response.ok) {
				if (method === 'get') {
					return new Uint8Array(await response.arrayBuffer());
				}
				responseData = await response.json();
				if (!(responseData === null || responseData === void 0 ? void 0 : responseData.error)) {
					return responseData === null || responseData === void 0 ? void 0 : responseData.data;
				}
			}
			if (!responseData) {
				responseData = await response.json();
			}
			throw new ClientError(
				(_b =
					(_a = responseData === null || responseData === void 0 ? void 0 : responseData.error) === null ||
					_a === void 0
						? void 0
						: _a.message) !== null && _b !== void 0
					? _b
					: response.statusText,
				route,
				response.status,
				(_c = responseData === null || responseData === void 0 ? void 0 : responseData.error) === null ||
				_c === void 0
					? void 0
					: _c.code
			);
		}
		/**
		 * Perform a fetch request.
		 * @param method The http method.
		 * @param route The route of the request.
		 * @param headers The headers for the request.
		 * @param requestData Request to send to the endpoint.
		 * @returns The response.
		 * @internal
		 */
		async fetchWithTimeout(method, route, headers, body) {
			let controller;
			let timerId;
			if (this._timeout !== undefined) {
				controller = new AbortController();
				timerId = setTimeout(() => {
					if (controller) {
						controller.abort();
					}
				}, this._timeout);
			}
			const finalHeaders = {};
			if (this._headers) {
				for (const header in this._headers) {
					finalHeaders[header] = this._headers[header];
				}
			}
			if (headers) {
				for (const header in headers) {
					finalHeaders[header] = headers[header];
				}
			}
			if (this._userName && this._password) {
				const userPass = util_js.Converter.bytesToBase64(
					util_js.Converter.utf8ToBytes(`${this._userName}:${this._password}`)
				);
				finalHeaders.Authorization = `Basic ${userPass}`;
			}
			try {
				const response = await fetch(`${this._endpoint}${route}`, {
					method,
					headers: finalHeaders,
					body,
					signal: controller ? controller.signal : undefined
				});
				return response;
			} catch (err) {
				throw err instanceof Error && err.name === 'AbortError' ? new Error('Timeout') : err;
			} finally {
				if (timerId) {
					clearTimeout(timerId);
				}
			}
		}
		/**
		 * Combine the query params.
		 * @param queryParams The quer params to combine.
		 * @returns The combined query params.
		 */
		combineQueryParams(queryParams) {
			return queryParams && queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
		}
	}
	/**
	 * A zero nonce.
	 * @internal
	 */
	SingleNodeClient.NONCE_ZERO = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);

	// Copyright 2020 IOTA Stiftung
	/**
	 * Indexer plugin which provides access to the indexer plugin API.
	 */
	class IndexerPluginClient {
		/**
		 * Create a new instance of IndexerPluginClient.
		 * @param client The client for communications.
		 * @param options Options for the plugin.
		 * @param options.basePluginPath Base path for the plugin routes,
		 * relative to client basePluginPath, defaults to indexer/v1/ .
		 */
		constructor(client, options) {
			var _a;
			this._client = typeof client === 'string' ? new SingleNodeClient(client) : client;
			this._basePluginPath =
				(_a = options === null || options === void 0 ? void 0 : options.basePluginPath) !== null &&
				_a !== void 0
					? _a
					: 'indexer/v1/';
		}
		/**
		 * Find outputs using filter options.
		 * @param filterOptions The options for filtering.
		 * @param filterOptions.addressBech32 Filter outputs that are unlockable by the address.
		 * @param filterOptions.hasStorageReturnCondition Filter for outputs having a storage return unlock condition.
		 * @param filterOptions.storageReturnAddressBech32 Filter for outputs with a certain storage return address.
		 * @param filterOptions.hasExpirationCondition Filter for outputs having an expiration unlock condition.
		 * @param filterOptions.expirationReturnAddressBech32 Filter for outputs with a certain expiration return address.
		 * @param filterOptions.expiresBefore Filter for outputs that expire before a certain unix time.
		 * @param filterOptions.expiresAfter Filter for outputs that expire after a certain unix time.
		 * @param filterOptions.hasTimelockCondition Filter for outputs having a timelock unlock condition.
		 * @param filterOptions.timelockedBefore Filter for outputs that are timelocked before a certain unix time.
		 * @param filterOptions.timelockedAfter Filter for outputs that are timelocked after a certain unix time.
		 * @param filterOptions.hasNativeTokens Filter for outputs having native tokens.
		 * @param filterOptions.minNativeTokenCount Filter for outputs that have at least an amount of native tokens.
		 * @param filterOptions.maxNativeTokenCount Filter for outputs that have at the most an amount of native tokens.
		 * @param filterOptions.senderBech32 Filter outputs by the sender.
		 * @param filterOptions.tagHex Filter outputs by the tag in hex format.
		 * @param filterOptions.createdBefore Filter for outputs that were created before the given time.
		 * @param filterOptions.createdAfter Filter for outputs that were created after the given time.
		 * @param filterOptions.pageSize Set the page size for the response.
		 * @param filterOptions.cursor Request the items from the given cursor, returned from a previous request.
		 * @returns The outputs with the requested filters.
		 */
		async outputs(filterOptions) {
			const queryParams = [];
			if (filterOptions) {
				if (filterOptions.addressBech32 !== undefined) {
					queryParams.push(`address=${filterOptions.addressBech32}`);
				}
				if (filterOptions.hasStorageReturnCondition) {
					queryParams.push(`hasStorageReturnCondition=${filterOptions.hasStorageReturnCondition}`);
				}
				if (filterOptions.storageReturnAddressBech32 !== undefined) {
					queryParams.push(`storageReturnAddress=${filterOptions.storageReturnAddressBech32}`);
				}
				if (filterOptions.hasExpirationCondition) {
					queryParams.push(`hasExpirationCondition=${filterOptions.hasExpirationCondition}`);
				}
				if (filterOptions.expirationReturnAddressBech32 !== undefined) {
					queryParams.push(`expirationReturnAddress=${filterOptions.expirationReturnAddressBech32}`);
				}
				if (filterOptions.expiresBefore !== undefined) {
					queryParams.push(`expiresBefore=${filterOptions.expiresBefore}`);
				}
				if (filterOptions.expiresAfter !== undefined) {
					queryParams.push(`expiresAfter=${filterOptions.expiresAfter}`);
				}
				if (filterOptions.hasTimelockCondition !== undefined) {
					queryParams.push(`hasTimelockCondition=${filterOptions.hasTimelockCondition}`);
				}
				if (filterOptions.timelockedBefore !== undefined) {
					queryParams.push(`timelockedBefore=${filterOptions.timelockedBefore}`);
				}
				if (filterOptions.timelockedAfter !== undefined) {
					queryParams.push(`timelockedAfter=${filterOptions.timelockedAfter}`);
				}
				if (filterOptions.hasNativeTokens !== undefined) {
					queryParams.push(`hasNativeTokens=${filterOptions.hasNativeTokens}`);
				}
				if (filterOptions.minNativeTokenCount !== undefined) {
					queryParams.push(`minNativeTokenCount=${filterOptions.minNativeTokenCount}`);
				}
				if (filterOptions.maxNativeTokenCount !== undefined) {
					queryParams.push(`maxNativeTokenCount=${filterOptions.maxNativeTokenCount}`);
				}
				if (filterOptions.senderBech32 !== undefined) {
					queryParams.push(`sender=${filterOptions.senderBech32}`);
				}
				if (filterOptions.tagHex !== undefined) {
					queryParams.push(`tag=${filterOptions.tagHex}`);
				}
				if (filterOptions.createdBefore !== undefined) {
					queryParams.push(`createdBefore=${filterOptions.createdBefore}`);
				}
				if (filterOptions.createdAfter !== undefined) {
					queryParams.push(`createdAfter=${filterOptions.createdAfter}`);
				}
				if (filterOptions.pageSize !== undefined) {
					queryParams.push(`pageSize=${filterOptions.pageSize}`);
				}
				if (filterOptions.cursor !== undefined) {
					queryParams.push(`cursor=${filterOptions.cursor}`);
				}
			}
			return this._client.pluginFetch(this._basePluginPath, 'get', 'outputs/basic', queryParams);
		}
		/**
		 * Find alises using filter options.
		 * @param filterOptions The options for filtering.
		 * @param filterOptions.stateControllerBech32 Filter for a certain state controller address.
		 * @param filterOptions.governorBech32 Filter for a certain governance controller address.
		 * @param filterOptions.hasNativeTokens Filter for outputs having native tokens.
		 * @param filterOptions.minNativeTokenCount Filter for outputs that have at least an amount of native tokens.
		 * @param filterOptions.maxNativeTokenCount Filter for outputs that have at the most an amount of native tokens.
		 * @param filterOptions.issuerBech32 Filter for a certain issuer.
		 * @param filterOptions.senderBech32 Filter outputs by the sender.
		 * @param filterOptions.createdBefore Filter for outputs that were created before the given time.
		 * @param filterOptions.createdAfter Filter for outputs that were created after the given time.
		 * @param filterOptions.pageSize Set the page size for the response.
		 * @param filterOptions.cursor Request the items from the given cursor, returned from a previous request.
		 * @returns The outputs with the requested filters.
		 */
		async aliases(filterOptions) {
			const queryParams = [];
			if (filterOptions) {
				if (filterOptions.stateControllerBech32 !== undefined) {
					queryParams.push(`stateController=${filterOptions.stateControllerBech32}`);
				}
				if (filterOptions.governorBech32 !== undefined) {
					queryParams.push(`governor=${filterOptions.governorBech32}`);
				}
				if (filterOptions.hasNativeTokens !== undefined) {
					queryParams.push(`hasNativeTokens=${filterOptions.hasNativeTokens}`);
				}
				if (filterOptions.minNativeTokenCount !== undefined) {
					queryParams.push(`minNativeTokenCount=${filterOptions.minNativeTokenCount}`);
				}
				if (filterOptions.maxNativeTokenCount !== undefined) {
					queryParams.push(`maxNativeTokenCount=${filterOptions.maxNativeTokenCount}`);
				}
				if (filterOptions.issuerBech32 !== undefined) {
					queryParams.push(`issuer=${filterOptions.issuerBech32}`);
				}
				if (filterOptions.senderBech32 !== undefined) {
					queryParams.push(`sender=${filterOptions.senderBech32}`);
				}
				if (filterOptions.createdBefore !== undefined) {
					queryParams.push(`createdBefore=${filterOptions.createdBefore}`);
				}
				if (filterOptions.createdAfter !== undefined) {
					queryParams.push(`createdAfter=${filterOptions.createdAfter}`);
				}
				if (filterOptions.pageSize !== undefined) {
					queryParams.push(`pageSize=${filterOptions.pageSize}`);
				}
				if (filterOptions.cursor !== undefined) {
					queryParams.push(`cursor=${filterOptions.cursor}`);
				}
			}
			return this._client.pluginFetch(this._basePluginPath, 'get', 'outputs/alias', queryParams);
		}
		/**
		 * Get the output for an alias.
		 * @param aliasId The alias to get the output for.
		 * @returns The output.
		 */
		async alias(aliasId) {
			if (!util_js.Converter.isHex(aliasId, true)) {
				throw new Error('The alias id does not appear to be hex format');
			}
			return this._client.pluginFetch(this._basePluginPath, 'get', `outputs/alias/${aliasId}`);
		}
		/**
		 * Find nfts using filter options.
		 * @param filterOptions The options for filtering.
		 * @param filterOptions.addressBech32 Filter outputs that are unlockable by the address.
		 * @param filterOptions.hasStorageReturnCondition Filter for outputs having a storage return unlock condition.
		 * @param filterOptions.storageReturnAddressBech32 Filter for outputs with a certain storage return address.
		 * @param filterOptions.hasExpirationCondition Filter for outputs having an expiration unlock condition.
		 * @param filterOptions.expirationReturnAddressBech32 Filter for outputs with a certain expiration return address.
		 * @param filterOptions.expiresBefore Filter for outputs that expire before a certain unix time.
		 * @param filterOptions.expiresAfter Filter for outputs that expire after a certain unix time.
		 * @param filterOptions.hasTimelockCondition Filter for outputs having a timelock unlock condition.
		 * @param filterOptions.timelockedBefore Filter for outputs that are timelocked before a certain unix time.
		 * @param filterOptions.timelockedAfter Filter for outputs that are timelocked after a certain unix time.
		 * @param filterOptions.hasNativeTokens Filter for outputs having native tokens.
		 * @param filterOptions.minNativeTokenCount Filter for outputs that have at least an amount of native tokens.
		 * @param filterOptions.maxNativeTokenCount Filter for outputs that have at the most an amount of native tokens.
		 * @param filterOptions.issuerBech32 Filter outputs by the issuer.
		 * @param filterOptions.senderBech32 Filter outputs by the sender.
		 * @param filterOptions.tagHex Filter outputs by the tag in hex format.
		 * @param filterOptions.createdBefore Filter for outputs that were created before the given time.
		 * @param filterOptions.createdAfter Filter for outputs that were created after the given time.
		 * @param filterOptions.pageSize Set the page size for the response.
		 * @param filterOptions.cursor Request the items from the given cursor, returned from a previous request.
		 * @returns The outputs with the requested filters.
		 */
		async nfts(filterOptions) {
			const queryParams = [];
			if (filterOptions) {
				if (filterOptions.addressBech32 !== undefined) {
					queryParams.push(`address=${filterOptions.addressBech32}`);
				}
				if (filterOptions.hasStorageReturnCondition) {
					queryParams.push(`hasStorageReturnCondition=${filterOptions.hasStorageReturnCondition}`);
				}
				if (filterOptions.storageReturnAddressBech32 !== undefined) {
					queryParams.push(`storageReturnAddress=${filterOptions.storageReturnAddressBech32}`);
				}
				if (filterOptions.hasExpirationCondition) {
					queryParams.push(`hasExpirationCondition=${filterOptions.hasExpirationCondition}`);
				}
				if (filterOptions.expirationReturnAddressBech32 !== undefined) {
					queryParams.push(`expirationReturnAddress=${filterOptions.expirationReturnAddressBech32}`);
				}
				if (filterOptions.expiresBefore !== undefined) {
					queryParams.push(`expiresBefore=${filterOptions.expiresBefore}`);
				}
				if (filterOptions.expiresAfter !== undefined) {
					queryParams.push(`expiresAfter=${filterOptions.expiresAfter}`);
				}
				if (filterOptions.hasTimelockCondition !== undefined) {
					queryParams.push(`hasTimelockCondition=${filterOptions.hasTimelockCondition}`);
				}
				if (filterOptions.timelockedBefore !== undefined) {
					queryParams.push(`timelockedBefore=${filterOptions.timelockedBefore}`);
				}
				if (filterOptions.timelockedAfter !== undefined) {
					queryParams.push(`timelockedAfter=${filterOptions.timelockedAfter}`);
				}
				if (filterOptions.hasNativeTokens !== undefined) {
					queryParams.push(`hasNativeTokens=${filterOptions.hasNativeTokens}`);
				}
				if (filterOptions.minNativeTokenCount !== undefined) {
					queryParams.push(`minNativeTokenCount=${filterOptions.minNativeTokenCount}`);
				}
				if (filterOptions.maxNativeTokenCount !== undefined) {
					queryParams.push(`maxNativeTokenCount=${filterOptions.maxNativeTokenCount}`);
				}
				if (filterOptions.issuerBech32 !== undefined) {
					queryParams.push(`issuer=${filterOptions.issuerBech32}`);
				}
				if (filterOptions.senderBech32 !== undefined) {
					queryParams.push(`sender=${filterOptions.senderBech32}`);
				}
				if (filterOptions.tagHex !== undefined) {
					queryParams.push(`tag=${filterOptions.tagHex}`);
				}
				if (filterOptions.createdBefore !== undefined) {
					queryParams.push(`createdBefore=${filterOptions.createdBefore}`);
				}
				if (filterOptions.createdAfter !== undefined) {
					queryParams.push(`createdAfter=${filterOptions.createdAfter}`);
				}
				if (filterOptions.pageSize !== undefined) {
					queryParams.push(`pageSize=${filterOptions.pageSize}`);
				}
				if (filterOptions.cursor !== undefined) {
					queryParams.push(`cursor=${filterOptions.cursor}`);
				}
			}
			return this._client.pluginFetch(this._basePluginPath, 'get', 'outputs/nft', queryParams);
		}
		/**
		 * Get the output for a nft.
		 * @param nftId The nft to get the output for.
		 * @returns The output.
		 */
		async nft(nftId) {
			if (!util_js.Converter.isHex(nftId, true)) {
				throw new Error('The nft id does not appear to be hex format');
			}
			return this._client.pluginFetch(this._basePluginPath, 'get', `outputs/nft/${nftId}`);
		}
		/**
		 * Find foundries using filter options.
		 * @param filterOptions The options for filtering.
		 * @param filterOptions.aliasAddressBech32 Filter outputs that are unlockable by the address.
		 * @param filterOptions.hasNativeTokens Filter for outputs having native tokens.
		 * @param filterOptions.minNativeTokenCount Filter for outputs that have at least an amount of native tokens.
		 * @param filterOptions.maxNativeTokenCount Filter for outputs that have at the most an amount of native tokens.
		 * @param filterOptions.createdBefore Filter for outputs that were created before the given time.
		 * @param filterOptions.createdAfter Filter for outputs that were created after the given time.
		 * @param filterOptions.pageSize Set the page size for the response.
		 * @param filterOptions.cursor Request the items from the given cursor, returned from a previous request.
		 * @returns The outputs with the requested filters.
		 */
		async foundries(filterOptions) {
			const queryParams = [];
			if (filterOptions) {
				if (filterOptions.aliasAddressBech32 !== undefined) {
					queryParams.push(`aliasAddress=${filterOptions.aliasAddressBech32}`);
				}
				if (filterOptions.hasNativeTokens !== undefined) {
					queryParams.push(`hasNativeTokens=${filterOptions.hasNativeTokens}`);
				}
				if (filterOptions.minNativeTokenCount !== undefined) {
					queryParams.push(`minNativeTokenCount=${filterOptions.minNativeTokenCount}`);
				}
				if (filterOptions.maxNativeTokenCount !== undefined) {
					queryParams.push(`maxNativeTokenCount=${filterOptions.maxNativeTokenCount}`);
				}
				if (filterOptions.createdBefore !== undefined) {
					queryParams.push(`createdBefore=${filterOptions.createdBefore}`);
				}
				if (filterOptions.createdAfter !== undefined) {
					queryParams.push(`createdAfter=${filterOptions.createdAfter}`);
				}
				if (filterOptions.pageSize !== undefined) {
					queryParams.push(`pageSize=${filterOptions.pageSize}`);
				}
				if (filterOptions.cursor !== undefined) {
					queryParams.push(`cursor=${filterOptions.cursor}`);
				}
			}
			return this._client.pluginFetch(this._basePluginPath, 'get', 'outputs/foundry', queryParams);
		}
		/**
		 * Get the output for a foundry.
		 * @param foundryId The foundry to get the output for.
		 * @returns The output.
		 */
		async foundry(foundryId) {
			if (!util_js.Converter.isHex(foundryId, true)) {
				throw new Error('The foundry id does not appear to be hex format');
			}
			return this._client.pluginFetch(this._basePluginPath, 'get', `outputs/foundry/${foundryId}`);
		}
	}

	// Copyright 2020 IOTA Stiftung
	// SPDX-License-Identifier: Apache-2.0
	/* eslint-disable no-bitwise */
	/**
	 * Class implements the b1t6 encoding encoding which uses a group of 6 trits to encode each byte.
	 */
	class B1T6 {
		/**
		 * The encoded length of the data.
		 * @param data The data.
		 * @returns The encoded length.
		 */
		static encodedLen(data) {
			return data.length * B1T6.TRITS_PER_TRYTE;
		}
		/**
		 * Encode a byte array into trits.
		 * @param dst The destination array.
		 * @param startIndex The start index to write in the array.
		 * @param src The source data.
		 * @returns The length of the encode.
		 */
		static encode(dst, startIndex, src) {
			let j = 0;
			for (let i = 0; i < src.length; i++) {
				// Convert to signed 8 bit value
				const v = ((src[i] << 24) >> 24) + 364;
				const rem = Math.trunc(v % 27);
				const quo = Math.trunc(v / 27);
				dst[startIndex + j] = B1T6.TRYTE_VALUE_TO_TRITS[rem][0];
				dst[startIndex + j + 1] = B1T6.TRYTE_VALUE_TO_TRITS[rem][1];
				dst[startIndex + j + 2] = B1T6.TRYTE_VALUE_TO_TRITS[rem][2];
				dst[startIndex + j + 3] = B1T6.TRYTE_VALUE_TO_TRITS[quo][0];
				dst[startIndex + j + 4] = B1T6.TRYTE_VALUE_TO_TRITS[quo][1];
				dst[startIndex + j + 5] = B1T6.TRYTE_VALUE_TO_TRITS[quo][2];
				j += 6;
			}
			return j;
		}
	}
	/**
	 * Trytes to trits lookup table.
	 * @internal
	 */
	B1T6.TRYTE_VALUE_TO_TRITS = [
		[-1, -1, -1],
		[0, -1, -1],
		[1, -1, -1],
		[-1, 0, -1],
		[0, 0, -1],
		[1, 0, -1],
		[-1, 1, -1],
		[0, 1, -1],
		[1, 1, -1],
		[-1, -1, 0],
		[0, -1, 0],
		[1, -1, 0],
		[-1, 0, 0],
		[0, 0, 0],
		[1, 0, 0],
		[-1, 1, 0],
		[0, 1, 0],
		[1, 1, 0],
		[-1, -1, 1],
		[0, -1, 1],
		[1, -1, 1],
		[-1, 0, 1],
		[0, 0, 1],
		[1, 0, 1],
		[-1, 1, 1],
		[0, 1, 1],
		[1, 1, 1]
	];
	/**
	 * Trites per tryte.
	 * @internal
	 */
	B1T6.TRITS_PER_TRYTE = 3;

	// Copyright 2020 IOTA Stiftung
	/**
	 * Get the balance for an address.
	 * @param client The client or node endpoint to get the information from.
	 * @param addressBech32 The address to get the balances for.
	 * @returns The balance.
	 */
	async function addressBalance(client, addressBech32) {
		var _a;
		const localClient = typeof client === 'string' ? new SingleNodeClient(client) : client;
		const indexerPluginClient = new IndexerPluginClient(localClient);
		let total = bigInt__default['default'](0);
		let ledgerIndex = 0;
		const nativeTokens = {};
		let response;
		let cursor;
		do {
			response = await indexerPluginClient.outputs({ addressBech32, cursor });
			for (const outputId of response.items) {
				const output = await localClient.output(outputId);
				if (!output.metadata.isSpent) {
					total = total.plus(output.output.amount);
					const nativeTokenOutput = output.output;
					if (Array.isArray(nativeTokenOutput.nativeTokens)) {
						for (const token of nativeTokenOutput.nativeTokens) {
							nativeTokens[token.id] =
								(_a = nativeTokens[token.id]) !== null && _a !== void 0
									? _a
									: bigInt__default['default'](0);
							nativeTokens[token.id] = nativeTokens[token.id].add(
								util_js.HexHelper.toBigInt256(token.amount)
							);
						}
					}
				}
				ledgerIndex = output.metadata.ledgerIndex;
			}
			cursor = response.cursor;
		} while (cursor && response.items.length > 0);
		return {
			balance: total,
			nativeTokens,
			ledgerIndex
		};
	}

	// Copyright 2020 IOTA Stiftung
	let IOTA_BIP44_BASE_PATH = "m/44'/4218'";
	function setIotaBip44BasePath(path) {
		IOTA_BIP44_BASE_PATH = path;
	}
	/**
	 * Generate a bip44 path based on all its parts.
	 * @param accountIndex The account index.
	 * @param addressIndex The address index.
	 * @param isInternal Is this an internal address.
	 * @returns The generated address.
	 */
	function generateBip44Path(accountIndex, addressIndex, isInternal) {
		const bip32Path = new crypto_js.Bip32Path(IOTA_BIP44_BASE_PATH);
		bip32Path.pushHardened(accountIndex);
		bip32Path.pushHardened(isInternal ? 1 : 0);
		bip32Path.pushHardened(addressIndex);
		return bip32Path;
	}
	/**
	 * Generate addresses based on the account indexing style.
	 * @param generatorState The address state.
	 * @param generatorState.accountIndex The index of the account to calculate.
	 * @param generatorState.addressIndex The index of the address to calculate.
	 * @param generatorState.isInternal Are we generating an internal address.
	 * @returns The key pair for the address.
	 */
	function generateBip44Address(generatorState) {
		const path = new crypto_js.Bip32Path(IOTA_BIP44_BASE_PATH);
		path.pushHardened(generatorState.accountIndex);
		path.pushHardened(generatorState.isInternal ? 1 : 0);
		path.pushHardened(generatorState.addressIndex);
		// Flip-flop between internal and external
		// and then increment the address Index
		if (!generatorState.isInternal) {
			generatorState.isInternal = true;
		} else {
			generatorState.isInternal = false;
			generatorState.addressIndex++;
		}
		return path.toString();
	}

	// Copyright 2020 IOTA Stiftung
	/**
	 * Convert address to bech32.
	 */
	class Bech32Helper {
		/**
		 * Encode an address to bech32.
		 * @param addressType The address type to encode.
		 * @param addressBytes The address bytes to encode.
		 * @param humanReadablePart The human readable part to use.
		 * @returns The array formated as hex.
		 */
		static toBech32(addressType, addressBytes, humanReadablePart) {
			const addressData = new Uint8Array(1 + addressBytes.length);
			addressData[0] = addressType;
			addressData.set(addressBytes, 1);
			return crypto_js.Bech32.encode(humanReadablePart, addressData);
		}
		/**
		 * Decode an address from bech32.
		 * @param bech32Text The bech32 text to decode.
		 * @param humanReadablePart The human readable part to use.
		 * @returns The address type and address bytes or undefined if it cannot be decoded.
		 */
		static fromBech32(bech32Text, humanReadablePart) {
			const decoded = crypto_js.Bech32.decode(bech32Text);
			if (decoded) {
				if (decoded.humanReadablePart !== humanReadablePart) {
					throw new Error(
						`The hrp part of the address should be ${humanReadablePart}, it is ${decoded.humanReadablePart}`
					);
				}
				if (decoded.data.length === 0) {
					throw new Error('The data part of the address should be at least length 1, it is 0');
				}
				const addressType = decoded.data[0];
				const addressBytes = decoded.data.slice(1);
				return {
					addressType,
					addressBytes
				};
			}
		}
		/**
		 * Decode an address from bech32.
		 * @param bech32Address The bech32 address to decode.
		 * @param humanReadablePart The human readable part to use.
		 * @returns The address type.
		 */
		static addressFromBech32(bech32Address, humanReadablePart) {
			const parsed = Bech32Helper.fromBech32(bech32Address, humanReadablePart);
			if (!parsed) {
				throw new Error("Can't decode address");
			}
			switch (parsed.addressType) {
				case ED25519_ADDRESS_TYPE: {
					return {
						type: ED25519_ADDRESS_TYPE,
						pubKeyHash: util_js.Converter.bytesToHex(parsed.addressBytes, true)
					};
				}
				case ALIAS_ADDRESS_TYPE: {
					return {
						type: ALIAS_ADDRESS_TYPE,
						aliasId: util_js.Converter.bytesToHex(parsed.addressBytes, true)
					};
				}
				case NFT_ADDRESS_TYPE: {
					return {
						type: NFT_ADDRESS_TYPE,
						nftId: util_js.Converter.bytesToHex(parsed.addressBytes, true)
					};
				}
				default: {
					throw new Error('Unexpected address type');
				}
			}
		}
		/**
		 * Does the provided string look like it might be an bech32 address with matching hrp.
		 * @param bech32Text The bech32 text to text.
		 * @param humanReadablePart The human readable part to match.
		 * @returns True if the passed address matches the pattern for a bech32 address.
		 */
		static matches(bech32Text, humanReadablePart) {
			return crypto_js.Bech32.matches(humanReadablePart, bech32Text);
		}
	}
	/**
	 * The default human readable part of the bech32 addresses for mainnet, currently 'iota'.
	 */
	Bech32Helper.BECH32_DEFAULT_HRP_MAIN = 'iota';
	/**
	 * The default human readable part of the bech32 addresses for devnet, currently 'atoi'.
	 */
	Bech32Helper.BECH32_DEFAULT_HRP_DEV = 'atoi';

	// Copyright 2020 IOTA Stiftung
	/**
	 * Get all the unspent addresses.
	 * @param client The client or node endpoint to send the transfer with.
	 * @param seed The seed to use for address generation.
	 * @param accountIndex The account index in the wallet.
	 * @param addressOptions Optional address configuration for balance address lookups.
	 * @param addressOptions.startIndex The start index for the wallet count address, defaults to 0.
	 * @param addressOptions.zeroCount The number of addresses with 0 balance during lookup before aborting.
	 * @param addressOptions.requiredCount The max number of addresses to find.
	 * @returns All the unspent addresses.
	 */
	async function getUnspentAddresses(client, seed, accountIndex, addressOptions) {
		var _a;
		return getUnspentAddressesWithAddressGenerator(
			client,
			seed,
			{
				accountIndex,
				addressIndex:
					(_a = addressOptions === null || addressOptions === void 0 ? void 0 : addressOptions.startIndex) !==
						null && _a !== void 0
						? _a
						: 0,
				isInternal: false
			},
			generateBip44Address,
			addressOptions
		);
	}
	/**
	 * Get all the unspent addresses using an address generator.
	 * @param client The client or node endpoint to get the addresses from.
	 * @param seed The seed to use for address generation.
	 * @param initialAddressState The initial address state for calculating the addresses.
	 * @param nextAddressPath Calculate the next address for inputs.
	 * @param addressOptions Optional address configuration for balance address lookups.
	 * @param addressOptions.startIndex The start index for the wallet count address, defaults to 0.
	 * @param addressOptions.zeroCount The number of addresses with 0 balance during lookup before aborting.
	 * @param addressOptions.requiredCount The max number of addresses to find.
	 * @returns All the unspent addresses.
	 */
	async function getUnspentAddressesWithAddressGenerator(
		client,
		seed,
		initialAddressState,
		nextAddressPath,
		addressOptions
	) {
		var _a, _b;
		const localClient = typeof client === 'string' ? new SingleNodeClient(client) : client;
		const protocolInfo = await localClient.protocolInfo();
		const localRequiredLimit =
			(_a = addressOptions === null || addressOptions === void 0 ? void 0 : addressOptions.requiredCount) !==
				null && _a !== void 0
				? _a
				: Number.MAX_SAFE_INTEGER;
		const localZeroCount =
			(_b = addressOptions === null || addressOptions === void 0 ? void 0 : addressOptions.zeroCount) !== null &&
			_b !== void 0
				? _b
				: 20;
		let finished = false;
		const allUnspent = [];
		let zeroBalance = 0;
		do {
			const path = nextAddressPath(initialAddressState);
			const addressSeed = seed.generateSeedFromPath(new crypto_js.Bip32Path(path));
			const ed25519Address = new Ed25519Address(addressSeed.keyPair().publicKey);
			const addressBytes = ed25519Address.toAddress();
			const addressBech32 = Bech32Helper.toBech32(ED25519_ADDRESS_TYPE, addressBytes, protocolInfo.bech32Hrp);
			const balance = await addressBalance(localClient, addressBech32);
			// If there is no balance we increment the counter and end
			// the text when we have reached the count
			if (balance.balance.equals(bigInt__default['default'](0))) {
				zeroBalance++;
				if (zeroBalance >= localZeroCount) {
					finished = true;
				}
			} else {
				allUnspent.push({
					address: addressBech32,
					path,
					balance: balance.balance
				});
				if (allUnspent.length === localRequiredLimit) {
					finished = true;
				}
			}
		} while (!finished);
		return allUnspent;
	}

	// Copyright 2020 IOTA Stiftung
	/**
	 * Get the balance for a list of addresses.
	 * @param client The client or node endpoint to send the transfer with.
	 * @param seed The seed.
	 * @param accountIndex The account index in the wallet.
	 * @param addressOptions Optional address configuration for balance address lookups.
	 * @param addressOptions.startIndex The start index for the wallet count address, defaults to 0.
	 * @param addressOptions.zeroCount The number of addresses with 0 balance during lookup before aborting.
	 * @returns The balance.
	 */
	async function getBalance(client, seed, accountIndex, addressOptions) {
		const allUnspent = await getUnspentAddresses(client, seed, accountIndex, addressOptions);
		let total = bigInt__default['default'](0);
		for (const output of allUnspent) {
			total = total.plus(output.balance);
		}
		return total;
	}

	/**
	 * Get the first unspent address.
	 * @param client The client or node endpoint to send the transfer with.
	 * @param seed The seed to use for address generation.
	 * @param accountIndex The account index in the wallet.
	 * @param addressOptions Optional address configuration for balance address lookups.
	 * @param addressOptions.startIndex The start index for the wallet count address, defaults to 0.
	 * @param addressOptions.zeroCount The number of addresses with 0 balance during lookup before aborting.
	 * @returns The first unspent address.
	 */
	async function getUnspentAddress(client, seed, accountIndex, addressOptions) {
		const allUnspent = await getUnspentAddresses(client, seed, accountIndex, {
			startIndex: addressOptions === null || addressOptions === void 0 ? void 0 : addressOptions.startIndex,
			zeroCount: addressOptions === null || addressOptions === void 0 ? void 0 : addressOptions.zeroCount,
			requiredCount: 1
		});
		return allUnspent.length > 0 ? allUnspent[0] : undefined;
	}

	// Copyright 2020 IOTA Stiftung
	/**
	 * Promote an existing block.
	 * @param client The clientor node endpoint to perform the promote with.
	 * @param blockId The block to promote.
	 * @returns The id and block that were promoted.
	 */
	async function promote(client, blockId) {
		const localClient = typeof client === 'string' ? new SingleNodeClient(client) : client;
		const block = await localClient.block(blockId);
		if (!block) {
			throw new Error('The block does not exist.');
		}
		const tipsResponse = await localClient.tips();
		// Parents must be unique and lexicographically sorted
		// so don't add the blockId if it is already one of the tips
		if (!tipsResponse.tips.includes(blockId)) {
			tipsResponse.tips.unshift(blockId);
		}
		// If we now exceed the max parents remove as many as we need
		if (tipsResponse.tips.length > MAX_NUMBER_PARENTS) {
			tipsResponse.tips = tipsResponse.tips.slice(0, MAX_NUMBER_PARENTS);
		}
		// Finally sort the list
		tipsResponse.tips.sort();
		const promoteBlockPartial = {
			parents: tipsResponse.tips
		};
		const promoteBlockId = await localClient.blockSubmit(promoteBlockPartial);
		return {
			block,
			blockId: promoteBlockId
		};
	}

	// Copyright 2020 IOTA Stiftung
	/**
	 * Reattach an existing block.
	 * @param client The client or node endpoint to perform the reattach with.
	 * @param blockId The block to reattach.
	 * @returns The id and block that were reattached.
	 */
	async function reattach(client, blockId) {
		const localClient = typeof client === 'string' ? new SingleNodeClient(client) : client;
		const block = await localClient.block(blockId);
		if (!block) {
			throw new Error('The block does not exist.');
		}
		const reattachBlockPartial = {
			payload: block.payload
		};
		const reattachedBlockId = await localClient.blockSubmit(reattachBlockPartial);
		return {
			block,
			blockId: reattachedBlockId
		};
	}

	// Copyright 2020 IOTA Stiftung
	/**
	 * Retrieve a data block.
	 * @param client The client or node endpoint to retrieve the data with.
	 * @param blockId The block id of the data to get.
	 * @returns The block tag and data.
	 */
	async function retrieveData(client, blockId) {
		const localClient = typeof client === 'string' ? new SingleNodeClient(client) : client;
		const block = await localClient.block(blockId);
		if (block === null || block === void 0 ? void 0 : block.payload) {
			let taggedDataPayload;
			if (block.payload.type === TRANSACTION_PAYLOAD_TYPE) {
				taggedDataPayload = block.payload.essence.payload;
			} else if (block.payload.type === TAGGED_DATA_PAYLOAD_TYPE) {
				taggedDataPayload = block.payload;
			}
			if (taggedDataPayload) {
				return {
					tag: taggedDataPayload.tag ? util_js.Converter.hexToBytes(taggedDataPayload.tag) : undefined,
					data: taggedDataPayload.data ? util_js.Converter.hexToBytes(taggedDataPayload.data) : undefined
				};
			}
		}
	}

	// Copyright 2020 IOTA Stiftung
	/**
	 * Retry an existing block either by promoting or reattaching.
	 * @param client The client or node endpoint to perform the retry with.
	 * @param blockId The block to retry.
	 * @returns The id and block that were retried.
	 */
	async function retry(client, blockId) {
		const localClient = typeof client === 'string' ? new SingleNodeClient(client) : client;
		const metadata = await localClient.blockMetadata(blockId);
		if (!metadata) {
			throw new Error('The block does not exist.');
		}
		if (metadata.shouldPromote) {
			return promote(client, blockId);
		} else if (metadata.shouldReattach) {
			return reattach(client, blockId);
		}
		throw new Error('The block should not be promoted or reattached.');
	}

	// Copyright 2020 IOTA Stiftung
	/**
	 * Send a transfer from the balance on the seed.
	 * @param client The client or node endpoint to send the transfer with.
	 * @param inputsAndSignatureKeyPairs The inputs with the signature key pairs needed to sign transfers.
	 * @param outputs The outputs to send.
	 * @param taggedData Optional tagged data to associate with the transaction.
	 * @param taggedData.tag Optional tag.
	 * @param taggedData.data Optional data.
	 * @returns The id of the block created and the remainder address if one was needed.
	 */
	async function sendAdvanced(client, inputsAndSignatureKeyPairs, outputs, taggedData) {
		const localClient = typeof client === 'string' ? new SingleNodeClient(client) : client;
		const protocolInfo = await localClient.protocolInfo();
		const transactionPayload = buildTransactionPayload(
			protocolInfo.networkId,
			inputsAndSignatureKeyPairs,
			outputs,
			taggedData
		);
		const block = {
			protocolVersion: DEFAULT_PROTOCOL_VERSION,
			parents: [],
			payload: transactionPayload,
			nonce: '0'
		};
		const blockId = await localClient.blockSubmit(block);
		return {
			blockId,
			block
		};
	}
	/**
	 * Build a transaction payload.
	 * @param networkId The network id we are sending the payload on.
	 * @param inputsAndSignatureKeyPairs The inputs with the signature key pairs needed to sign transfers.
	 * @param outputs The outputs to send.
	 * @param taggedData Optional tagged data to associate with the transaction.
	 * @param taggedData.tag Optional tag.
	 * @param taggedData.data Optional index data.
	 * @returns The transaction payload.
	 */
	function buildTransactionPayload(networkId, inputsAndSignatureKeyPairs, outputs, taggedData) {
		if (!inputsAndSignatureKeyPairs || inputsAndSignatureKeyPairs.length === 0) {
			throw new Error('You must specify some inputs');
		}
		if (!outputs || outputs.length === 0) {
			throw new Error('You must specify some outputs');
		}
		let localTagHex;
		let localDataHex;
		if (taggedData === null || taggedData === void 0 ? void 0 : taggedData.tag) {
			localTagHex =
				typeof (taggedData === null || taggedData === void 0 ? void 0 : taggedData.tag) === 'string'
					? util_js.Converter.utf8ToHex(taggedData.tag, true)
					: util_js.Converter.bytesToHex(taggedData.tag, true);
			// Length is -2 becuase we have added the 0x prefix
			if ((localTagHex.length - 2) / 2 > MAX_TAG_LENGTH) {
				throw new Error(
					`The tag length is ${localTagHex.length / 2}, which exceeds the maximum size of ${MAX_TAG_LENGTH}`
				);
			}
		}
		if (taggedData === null || taggedData === void 0 ? void 0 : taggedData.data) {
			localDataHex = util_js.HexHelper.addPrefix(
				typeof taggedData.data === 'string'
					? util_js.Converter.utf8ToHex(taggedData.data, true)
					: util_js.Converter.bytesToHex(taggedData.data, true)
			);
		}
		const outputsWithSerialization = [];
		for (const output of outputs) {
			if (output.addressType === ED25519_ADDRESS_TYPE) {
				const o = {
					type: BASIC_OUTPUT_TYPE,
					amount: output.amount.toString(),
					nativeTokens: [],
					unlockConditions: [
						{
							type: ADDRESS_UNLOCK_CONDITION_TYPE,
							address: {
								type: output.addressType,
								pubKeyHash: output.address
							}
						}
					],
					features: []
				};
				const writeStream = new util_js.WriteStream();
				serializeOutput(writeStream, o);
				const finalBytes = writeStream.finalBytes();
				outputsWithSerialization.push({
					output: o,
					serializedBytes: finalBytes,
					serializedHex: util_js.Converter.bytesToHex(finalBytes)
				});
			} else {
				throw new Error(`Unrecognized output address type ${output.addressType}`);
			}
		}
		const inputsAndSignatureKeyPairsSerialized = inputsAndSignatureKeyPairs.map((i) => {
			const writeStreamId = new util_js.WriteStream();
			writeStreamId.writeFixedHex('transactionId', TRANSACTION_ID_LENGTH, i.input.transactionId);
			writeStreamId.writeUInt16('transactionOutputIndex', i.input.transactionOutputIndex);
			const writeStream = new util_js.WriteStream();
			serializeOutput(writeStream, i.consumingOutput);
			return {
				...i,
				inputIdHex: writeStreamId.finalHex(),
				consumingOutputBytes: writeStream.finalBytes()
			};
		});
		const inputsCommitmentHasher = new crypto_js.Blake2b(crypto_js.Blake2b.SIZE_256);
		for (const input of inputsAndSignatureKeyPairsSerialized) {
			inputsCommitmentHasher.update(crypto_js.Blake2b.sum256(input.consumingOutputBytes));
		}
		const inputsCommitment = util_js.Converter.bytesToHex(inputsCommitmentHasher.final(), true);
		const transactionEssence = {
			type: TRANSACTION_ESSENCE_TYPE,
			networkId,
			inputs: inputsAndSignatureKeyPairsSerialized.map((i) => i.input),
			inputsCommitment,
			outputs: outputsWithSerialization.map((o) => o.output),
			payload:
				localTagHex && localDataHex
					? {
							type: TAGGED_DATA_PAYLOAD_TYPE,
							tag: localTagHex,
							data: localDataHex
					  }
					: undefined
		};
		const binaryEssence = new util_js.WriteStream();
		serializeTransactionEssence(binaryEssence, transactionEssence);
		const essenceFinal = binaryEssence.finalBytes();
		const essenceHash = crypto_js.Blake2b.sum256(essenceFinal);
		// Create the unlocks
		const unlocks = [];
		const addressToUnlock = {};
		for (const input of inputsAndSignatureKeyPairsSerialized) {
			const hexInputAddressPublic = util_js.Converter.bytesToHex(input.addressKeyPair.publicKey, true);
			if (addressToUnlock[hexInputAddressPublic]) {
				unlocks.push({
					type: REFERENCE_UNLOCK_TYPE,
					reference: addressToUnlock[hexInputAddressPublic].unlockIndex
				});
			} else {
				unlocks.push({
					type: SIGNATURE_UNLOCK_TYPE,
					signature: {
						type: ED25519_SIGNATURE_TYPE,
						publicKey: hexInputAddressPublic,
						signature: util_js.Converter.bytesToHex(
							crypto_js.Ed25519.sign(input.addressKeyPair.privateKey, essenceHash),
							true
						)
					}
				});
				addressToUnlock[hexInputAddressPublic] = {
					keyPair: input.addressKeyPair,
					unlockIndex: unlocks.length - 1
				};
			}
		}
		const transactionPayload = {
			type: TRANSACTION_PAYLOAD_TYPE,
			essence: transactionEssence,
			unlocks
		};
		return transactionPayload;
	}

	// Copyright 2020 IOTA Stiftung
	/**
	 * Send a transfer from the balance on the seed to a single output.
	 * @param client The client or node endpoint to send the transfer with.
	 * @param seed The seed to use for address generation.
	 * @param accountIndex The account index in the wallet.
	 * @param addressBech32 The address to send the funds to in bech32 format.
	 * @param amount The amount to send.
	 * @param taggedData Optional tagged data to associate with the transaction.
	 * @param taggedData.tag Optional tag.
	 * @param taggedData.data Optional data.
	 * @param addressOptions Optional address configuration for balance address lookups.
	 * @param addressOptions.startIndex The start index for the wallet count address, defaults to 0.
	 * @param addressOptions.zeroCount The number of addresses with 0 balance during lookup before aborting.
	 * @returns The id of the block created and the contructed block.
	 */
	async function send(client, seed, accountIndex, addressBech32, amount, taggedData, addressOptions) {
		return sendMultiple(client, seed, accountIndex, [{ addressBech32, amount }], taggedData, addressOptions);
	}
	/**
	 * Send a transfer from the balance on the seed to a single output.
	 * @param client The client or node endpoint to send the transfer with.
	 * @param seed The seed to use for address generation.
	 * @param accountIndex The account index in the wallet.
	 * @param addressEd25519 The address to send the funds to in ed25519 format.
	 * @param amount The amount to send.
	 * @param taggedData Optional tagged data to associate with the transaction.
	 * @param taggedData.tag Optional tag.
	 * @param taggedData.data Optional data.
	 * @param addressOptions Optional address configuration for balance address lookups.
	 * @param addressOptions.startIndex The start index for the wallet count address, defaults to 0.
	 * @param addressOptions.zeroCount The number of addresses with 0 balance during lookup before aborting.
	 * @returns The id of the block created and the contructed block.
	 */
	async function sendEd25519(client, seed, accountIndex, addressEd25519, amount, taggedData, addressOptions) {
		return sendMultipleEd25519(
			client,
			seed,
			accountIndex,
			[{ addressEd25519, amount }],
			taggedData,
			addressOptions
		);
	}
	/**
	 * Send a transfer from the balance on the seed to multiple outputs.
	 * @param client The client or node endpoint to send the transfer with.
	 * @param seed The seed to use for address generation.
	 * @param accountIndex The account index in the wallet.
	 * @param outputs The address to send the funds to in bech32 format and amounts.
	 * @param taggedData Optional tagged data to associate with the transaction.
	 * @param taggedData.tag Optional tag.
	 * @param taggedData.data Optional data.
	 * @param addressOptions Optional address configuration for balance address lookups.
	 * @param addressOptions.startIndex The start index for the wallet count address, defaults to 0.
	 * @param addressOptions.zeroCount The number of addresses with 0 balance during lookup before aborting.
	 * @returns The id of the block created and the contructed block.
	 */
	async function sendMultiple(client, seed, accountIndex, outputs, taggedData, addressOptions) {
		var _a;
		const localClient = typeof client === 'string' ? new SingleNodeClient(client) : client;
		const protocolInfo = await localClient.protocolInfo();
		const hexOutputs = outputs.map((output) => {
			const bech32Details = Bech32Helper.fromBech32(output.addressBech32, protocolInfo.bech32Hrp);
			if (!bech32Details) {
				throw new Error('Unable to decode bech32 address');
			}
			return {
				address: util_js.Converter.bytesToHex(bech32Details.addressBytes, true),
				addressType: bech32Details.addressType,
				amount: output.amount
			};
		});
		return sendWithAddressGenerator(
			client,
			seed,
			{
				accountIndex,
				addressIndex:
					(_a = addressOptions === null || addressOptions === void 0 ? void 0 : addressOptions.startIndex) !==
						null && _a !== void 0
						? _a
						: 0,
				isInternal: false
			},
			generateBip44Address,
			hexOutputs,
			taggedData,
			addressOptions === null || addressOptions === void 0 ? void 0 : addressOptions.zeroCount
		);
	}
	/**
	 * Send a transfer from the balance on the seed.
	 * @param client The client or node endpoint to send the transfer with.
	 * @param seed The seed to use for address generation.
	 * @param accountIndex The account index in the wallet.
	 * @param outputs The outputs including address to send the funds to in ed25519 format and amount.
	 * @param taggedData Optional tagged data to associate with the transaction.
	 * @param taggedData.tag Optional tag.
	 * @param taggedData.data Optional data.
	 * @param addressOptions Optional address configuration for balance address lookups.
	 * @param addressOptions.startIndex The start index for the wallet count address, defaults to 0.
	 * @param addressOptions.zeroCount The number of addresses with 0 balance during lookup before aborting.
	 * @returns The id of the block created and the contructed block.
	 */
	async function sendMultipleEd25519(client, seed, accountIndex, outputs, taggedData, addressOptions) {
		var _a;
		const hexOutputs = outputs.map((output) => ({
			address: output.addressEd25519,
			addressType: ED25519_ADDRESS_TYPE,
			amount: output.amount
		}));
		return sendWithAddressGenerator(
			client,
			seed,
			{
				accountIndex,
				addressIndex:
					(_a = addressOptions === null || addressOptions === void 0 ? void 0 : addressOptions.startIndex) !==
						null && _a !== void 0
						? _a
						: 0,
				isInternal: false
			},
			generateBip44Address,
			hexOutputs,
			taggedData,
			addressOptions === null || addressOptions === void 0 ? void 0 : addressOptions.zeroCount
		);
	}
	/**
	 * Send a transfer using account based indexing for the inputs.
	 * @param client The client or node endpoint to send the transfer with.
	 * @param seed The seed to use for address generation.
	 * @param initialAddressState The initial address state for calculating the addresses.
	 * @param nextAddressPath Calculate the next address for inputs.
	 * @param outputs The address to send the funds to in bech32 format and amounts.
	 * @param taggedData Optional tagged data to associate with the transaction.
	 * @param taggedData.tag Optional tag.
	 * @param taggedData.data Optional data.
	 * @param zeroCount The number of addresses with 0 balance during lookup before aborting.
	 * @returns The id of the block created and the contructed block.
	 */
	async function sendWithAddressGenerator(
		client,
		seed,
		initialAddressState,
		nextAddressPath,
		outputs,
		taggedData,
		zeroCount
	) {
		const inputsAndKeys = await calculateInputs(
			client,
			seed,
			initialAddressState,
			nextAddressPath,
			outputs,
			zeroCount
		);
		const response = await sendAdvanced(client, inputsAndKeys, outputs, taggedData);
		return {
			blockId: response.blockId,
			block: response.block
		};
	}
	/**
	 * Calculate the inputs from the seed and basePath.
	 * @param client The client or node endpoint to calculate the inputs with.
	 * @param seed The seed to use for address generation.
	 * @param initialAddressState The initial address state for calculating the addresses.
	 * @param nextAddressPath Calculate the next address for inputs.
	 * @param outputs The outputs to send.
	 * @param zeroCount Abort when the number of zero balances is exceeded.
	 * @returns The id of the block created and the contructed block.
	 */
	async function calculateInputs(client, seed, initialAddressState, nextAddressPath, outputs, zeroCount = 5) {
		const localClient = typeof client === 'string' ? new SingleNodeClient(client) : client;
		const protocolInfo = await localClient.protocolInfo();
		let requiredBalance = bigInt__default['default'](0);
		for (const output of outputs) {
			requiredBalance = requiredBalance.plus(output.amount);
		}
		let consumedBalance = bigInt__default['default'](0);
		const inputsAndSignatureKeyPairs = [];
		let finished = false;
		let zeroBalance = 0;
		do {
			const path = nextAddressPath(initialAddressState);
			const addressSeed = seed.generateSeedFromPath(new crypto_js.Bip32Path(path));
			const addressKeyPair = addressSeed.keyPair();
			const ed25519Address = new Ed25519Address(addressKeyPair.publicKey);
			const addressBytes = ed25519Address.toAddress();
			const indexerPlugin = new IndexerPluginClient(client);
			const addressOutputIds = await indexerPlugin.outputs({
				addressBech32: Bech32Helper.toBech32(ED25519_ADDRESS_TYPE, addressBytes, protocolInfo.bech32Hrp)
			});
			if (addressOutputIds.items.length === 0) {
				zeroBalance++;
				if (zeroBalance >= zeroCount) {
					finished = true;
				}
			} else {
				for (const addressOutputId of addressOutputIds.items) {
					const addressOutput = await localClient.output(addressOutputId);
					const addressUnlockCondition = addressOutput.output.unlockConditions.find(
						(u) => u.type === EXPIRATION_UNLOCK_CONDITION_TYPE
					);
					if (
						!addressOutput.metadata.isSpent &&
						consumedBalance.lesser(requiredBalance) &&
						!addressUnlockCondition
					) {
						if (bigInt__default['default'](addressOutput.output.amount).equals(0)) {
							zeroBalance++;
							if (zeroBalance >= zeroCount) {
								finished = true;
							}
						} else {
							consumedBalance = consumedBalance.plus(addressOutput.output.amount);
							const input = {
								type: UTXO_INPUT_TYPE,
								transactionId: addressOutput.metadata.transactionId,
								transactionOutputIndex: addressOutput.metadata.outputIndex
							};
							inputsAndSignatureKeyPairs.push({
								input,
								addressKeyPair,
								consumingOutput: addressOutput.output
							});
							if (consumedBalance >= requiredBalance) {
								// We didn't use all the balance from the last input
								// so return the rest to the same address.
								if (
									consumedBalance.minus(requiredBalance).greater(0) &&
									addressOutput.output.type === BASIC_OUTPUT_TYPE
								) {
									const addressUnlockCondition = addressOutput.output.unlockConditions.find(
										(u) => u.type === ADDRESS_UNLOCK_CONDITION_TYPE
									);
									if (
										addressUnlockCondition &&
										addressUnlockCondition.type === ADDRESS_UNLOCK_CONDITION_TYPE &&
										addressUnlockCondition.address.type === ED25519_ADDRESS_TYPE
									) {
										outputs.push({
											amount: consumedBalance.minus(requiredBalance),
											address: addressUnlockCondition.address.pubKeyHash,
											addressType: addressUnlockCondition.address.type
										});
									}
								}
								finished = true;
							}
						}
					}
				}
			}
		} while (!finished);
		if (consumedBalance < requiredBalance) {
			throw new Error('There are not enough funds in the inputs for the required balance');
		}
		return inputsAndSignatureKeyPairs;
	}

	// Copyright 2020 IOTA Stiftung
	/**
	 * Send a data block.
	 * @param client The client or node endpoint to send the data with.
	 * @param tag The tag for the data.
	 * @param data The data as either UTF8 text or Uint8Array bytes.
	 * @returns The id of the block created and the block.
	 */
	async function sendData(client, tag, data) {
		const localClient = typeof client === 'string' ? new SingleNodeClient(client) : client;
		let localTagHex;
		let localDataHex;
		if (tag) {
			localTagHex =
				typeof tag === 'string'
					? util_js.Converter.utf8ToHex(tag, true)
					: util_js.Converter.bytesToHex(tag, true);
			// Length is -2 becuase we have added the 0x prefix
			if ((localTagHex.length - 2) / 2 > MAX_TAG_LENGTH) {
				throw new Error(
					`The tag length is ${localTagHex.length / 2}, which exceeds the maximum size of ${MAX_TAG_LENGTH}`
				);
			}
		}
		if (data) {
			localDataHex = util_js.HexHelper.addPrefix(
				typeof data === 'string'
					? util_js.Converter.utf8ToHex(data, true)
					: util_js.Converter.bytesToHex(data, true)
			);
		}
		const taggedDataPayload =
			localTagHex && localDataHex
				? {
						type: TAGGED_DATA_PAYLOAD_TYPE,
						tag: localTagHex,
						data: localDataHex
				  }
				: undefined;
		const block = {
			payload: taggedDataPayload
		};
		const blockId = await localClient.blockSubmit(block);
		return {
			block,
			blockId
		};
	}

	// Copyright 2020 IOTA Stiftung
	// SPDX-License-Identifier: Apache-2.0
	/**
	 * Reason for block conflicts.
	 */
	// eslint-disable-next-line no-shadow
	exports.ConflictReason = void 0;
	(function (ConflictReason) {
		/**
		 * The block has no conflict.
		 */
		ConflictReason[(ConflictReason['none'] = 0)] = 'none';
		/**
		 * The referenced UTXO was already spent.
		 */
		ConflictReason[(ConflictReason['inputUTXOAlreadySpent'] = 1)] = 'inputUTXOAlreadySpent';
		/**
		 * The referenced UTXO was already spent while confirming this milestone.
		 */
		ConflictReason[(ConflictReason['inputUTXOAlreadySpentInThisMilestone'] = 2)] =
			'inputUTXOAlreadySpentInThisMilestone';
		/**
		 * The referenced UTXO cannot be found.
		 */
		ConflictReason[(ConflictReason['inputUTXONotFound'] = 3)] = 'inputUTXONotFound';
		/**
		 * The sum of the inputs and output values does not match.
		 */
		ConflictReason[(ConflictReason['inputOutputSumMismatch'] = 4)] = 'inputOutputSumMismatch';
		/**
		 * The unlock signature is invalid.
		 */
		ConflictReason[(ConflictReason['invalidSignature'] = 5)] = 'invalidSignature';
		/**
		 * The configured timelock is not yet expired.
		 */
		ConflictReason[(ConflictReason['invalidTimelock'] = 6)] = 'invalidTimelock';
		/**
		 * The native tokens are invalid.
		 */
		ConflictReason[(ConflictReason['invalidNativeTokens'] = 7)] = 'invalidNativeTokens';
		/**
		 * The return amount in a transaction is not fulfilled by the output side.
		 */
		ConflictReason[(ConflictReason['returnAmountMismatch'] = 8)] = 'returnAmountMismatch';
		/**
		 * The input unlock is invalid.
		 */
		ConflictReason[(ConflictReason['invalidInputUnlock'] = 9)] = 'invalidInputUnlock';
		/**
		 * The inputs commitment is invalid.
		 */
		ConflictReason[(ConflictReason['invalidInputsCommitment'] = 10)] = 'invalidInputsCommitment';
		/**
		 * The output contains a Sender with an ident (address) which is not unlocked.
		 */
		ConflictReason[(ConflictReason['invalidSender'] = 11)] = 'invalidSender';
		/**
		 * The chain state transition is invalid.
		 */
		ConflictReason[(ConflictReason['invalidChainState'] = 12)] = 'invalidChainState';
		/**
		 * The semantic validation failed.
		 */
		ConflictReason[(ConflictReason['semanticValidationFailed'] = 255)] = 'semanticValidationFailed';
	})(exports.ConflictReason || (exports.ConflictReason = {}));

	// Copyright 2020 IOTA Stiftung
	/**
	 * Helper methods for POW.
	 */
	class PowHelper {
		/**
		 * Perform the score calculation.
		 * @param block The data to perform the score on.
		 * @returns The score for the data.
		 */
		static score(block) {
			// the PoW digest is the hash of block without the nonce
			const powRelevantData = block.slice(0, -8);
			const powDigest = crypto_js.Blake2b.sum256(powRelevantData);
			const nonce = util_js.BigIntHelper.read8(block, block.length - 8);
			const zeros = PowHelper.trailingZeros(powDigest, nonce);
			return Math.pow(3, zeros) / block.length;
		}
		/**
		 * Calculate the number of zeros required to get target score.
		 * @param block The block to process.
		 * @param targetScore The target score.
		 * @returns The number of zeros to find.
		 */
		static calculateTargetZeros(block, targetScore) {
			return Math.ceil(Math.log(block.length * targetScore) / this.LN3);
		}
		/**
		 * Calculate the trailing zeros.
		 * @param powDigest The pow digest.
		 * @param nonce The nonce.
		 * @returns The trailing zeros.
		 */
		static trailingZeros(powDigest, nonce) {
			const buf = new Int8Array(crypto_js.Curl.HASH_LENGTH);
			const digestTritsLen = B1T6.encode(buf, 0, powDigest);
			const biArr = new Uint8Array(8);
			util_js.BigIntHelper.write8(nonce, biArr, 0);
			B1T6.encode(buf, digestTritsLen, biArr);
			const curl = new crypto_js.Curl();
			curl.absorb(buf, 0, crypto_js.Curl.HASH_LENGTH);
			const hash = new Int8Array(crypto_js.Curl.HASH_LENGTH);
			curl.squeeze(hash, 0, crypto_js.Curl.HASH_LENGTH);
			return PowHelper.trinaryTrailingZeros(hash);
		}
		/**
		 * Find the number of trailing zeros.
		 * @param trits The trits to look for zeros.
		 * @param endPos The end position to start looking for zeros.
		 * @returns The number of trailing zeros.
		 */
		static trinaryTrailingZeros(trits, endPos = trits.length) {
			let z = 0;
			for (let i = endPos - 1; i >= 0 && trits[i] === 0; i--) {
				z++;
			}
			return z;
		}
		/**
		 * Perform the hash on the data until we reach target number of zeros.
		 * @param powDigest The pow digest.
		 * @param targetZeros The target number of zeros.
		 * @param startIndex The index to start looking from.
		 * @returns The nonce.
		 */
		static performPow(powDigest, targetZeros, startIndex) {
			let nonce = bigInt__default['default'](startIndex);
			let returnNonce;
			const buf = new Int8Array(crypto_js.Curl.HASH_LENGTH);
			const digestTritsLen = B1T6.encode(buf, 0, powDigest);
			const biArr = new Uint8Array(8);
			do {
				util_js.BigIntHelper.write8(nonce, biArr, 0);
				B1T6.encode(buf, digestTritsLen, biArr);
				const curlState = new Int8Array(crypto_js.Curl.STATE_LENGTH);
				curlState.set(buf, 0);
				crypto_js.Curl.transform(curlState, 81);
				if (PowHelper.trinaryTrailingZeros(curlState, crypto_js.Curl.HASH_LENGTH) >= targetZeros) {
					returnNonce = nonce;
				} else {
					nonce = nonce.plus(1);
				}
			} while (returnNonce === undefined);
			return returnNonce ? returnNonce.toString() : '0';
		}
	}
	/**
	 * LN3 Const see https://oeis.org/A002391.
	 * 1.098612288668109691395245236922525704647490557822749451734694333 .
	 */
	PowHelper.LN3 = 1.0986122886681098;

	// Copyright 2020 IOTA Stiftung
	/**
	 * Local POW Provider.
	 * WARNING - This is really slow.
	 */
	class LocalPowProvider {
		/**
		 * Perform pow on the block and return the nonce of at least targetScore.
		 * @param block The block to process.
		 * @param targetScore The target score.
		 * @returns The nonce.
		 */
		async pow(block, targetScore) {
			const powRelevantData = block.slice(0, -8);
			const powDigest = crypto_js.Blake2b.sum256(powRelevantData);
			const targetZeros = PowHelper.calculateTargetZeros(block, targetScore);
			return PowHelper.performPow(powDigest, targetZeros, '0').toString();
		}
	}

	// Copyright 2020 IOTA Stiftung
	/**
	 * Conflict reason strings.
	 */
	const CONFLICT_REASON_STRINGS = {
		[exports.ConflictReason.none]: 'Not conflicting',
		[exports.ConflictReason.inputUTXOAlreadySpent]: 'The referenced UTXO was already spent',
		[exports.ConflictReason.inputUTXOAlreadySpentInThisMilestone]:
			'The referenced UTXO was already spent while confirming this milestone',
		[exports.ConflictReason.inputUTXONotFound]: 'The referenced UTXO cannot be found',
		[exports.ConflictReason.inputOutputSumMismatch]: 'The sum of the inputs and output values does not match',
		[exports.ConflictReason.invalidSignature]: 'The unlock signature is invalid',
		[exports.ConflictReason.invalidTimelock]: 'The configured timelock is not yet expired',
		[exports.ConflictReason.invalidNativeTokens]: 'The native tokens are invalid',
		[exports.ConflictReason.returnAmountMismatch]:
			'The return amount in a transaction is not fulfilled by the output side',
		[exports.ConflictReason.invalidInputUnlock]: 'The input unlock is invalid',
		[exports.ConflictReason.invalidInputsCommitment]: 'The inputs commitment is invalid',
		[exports.ConflictReason.invalidSender]:
			'The output contains a Sender with an ident (address) which is not unlocked',
		[exports.ConflictReason.invalidChainState]: 'The chain state transition is invalid',
		[exports.ConflictReason.semanticValidationFailed]: 'The semantic validation failed'
	};

	/**
	 * The global type for the seed.
	 */
	const ED25519_SEED_TYPE = 1;
	/**
	 * Class to help with seeds.
	 */
	class Ed25519Seed {
		/**
		 * Create a new instance of Ed25519Seed.
		 * @param secretKeyBytes The bytes.
		 */
		constructor(secretKeyBytes) {
			this._secretKey = secretKeyBytes !== null && secretKeyBytes !== void 0 ? secretKeyBytes : new Uint8Array();
		}
		/**
		 * Create the seed from a Bip39 mnemonic.
		 * @param mnemonic The mnemonic to create the seed from.
		 * @returns A new instance of Ed25519Seed.
		 */
		static fromMnemonic(mnemonic) {
			return new Ed25519Seed(crypto_js.Bip39.mnemonicToSeed(mnemonic));
		}
		/**
		 * Get the key pair from the seed.
		 * @returns The key pair.
		 */
		keyPair() {
			const signKeyPair = crypto_js.Ed25519.keyPairFromSeed(this._secretKey);
			return {
				publicKey: signKeyPair.publicKey,
				privateKey: signKeyPair.privateKey
			};
		}
		/**
		 * Generate a new seed from the path.
		 * @param path The path to generate the seed for.
		 * @returns The generated seed.
		 */
		generateSeedFromPath(path) {
			const keys = crypto_js.Slip0010.derivePath(this._secretKey, path);
			return new Ed25519Seed(keys.privateKey);
		}
		/**
		 * Return the key as bytes.
		 * @returns The key as bytes.
		 */
		toBytes() {
			return this._secretKey;
		}
	}

	// Copyright 2020 IOTA Stiftung
	/**
	 * Compute a milestoneId from a milestone payload.
	 * @param payload The milestone payload.
	 * @returns The milestone id hex prefixed string.
	 */
	function milestoneIdFromMilestonePayload(payload) {
		const writeStream = new util_js.WriteStream();
		serializeMilestoneEssence(writeStream, payload);
		const essenceFinal = writeStream.finalBytes();
		const essenceHash = crypto_js.Blake2b.sum256(essenceFinal);
		return util_js.Converter.bytesToHex(essenceHash, true);
	}
	/**
	 * Compute a blockId from a milestone payload.
	 * @param protocolVersion The protocol version to use.
	 * @param payload The milestone payload.
	 * @returns The blockId of the block with the milestone payload.
	 */
	function blockIdFromMilestonePayload(protocolVersion, payload) {
		const writeStream = new util_js.WriteStream();
		const block = {
			protocolVersion,
			parents: payload.parents,
			payload,
			nonce: '0'
		};
		serializeBlock(writeStream, block);
		const blockFinal = writeStream.finalBytes();
		const blockHash = crypto_js.Blake2b.sum256(blockFinal);
		return util_js.Converter.bytesToHex(blockHash, true);
	}

	// Copyright 2020 IOTA Stiftung
	/**
	 * The logger used by the log methods.
	 * @param message The message to output.
	 * @param data The data to output.
	 * @returns Nothing.
	 */
	// eslint-disable-next-line no-confusing-arrow
	let logger = (message, data) => (data !== undefined ? console.log(message, data) : console.log(message));
	/**
	 * Set the logger for output.
	 * @param log The logger.
	 */
	function setLogger(log) {
		logger = log;
	}
	/**
	 * Log the routes of the node.
	 * @param prefix The prefix for the output.
	 * @param routes The available routes.
	 */
	function logRoutes(prefix, routes) {
		logger(`${prefix}\tRoutes:`, routes.routes);
	}
	/**
	 * Log the node information.
	 * @param prefix The prefix for the output.
	 * @param info The info to log.
	 */
	function logInfo(prefix, info) {
		logger(`${prefix}\tName:`, info.name);
		logger(`${prefix}\tVersion:`, info.version);
		logger(`${prefix}\tStatus`);
		logger(`${prefix}\t\tIs Healthy:`, info.status.isHealthy);
		logger(`${prefix}\t\tLatest Milestone Index:`, info.status.latestMilestone.index);
		logger(`${prefix}\t\tLatest Milestone Timestamp:`, info.status.latestMilestone.timestamp);
		logger(`${prefix}\t\tLatest Milestone Id:`, info.status.latestMilestone.milestoneId);
		logger(`${prefix}\t\tConfirmed Milestone Index:`, info.status.confirmedMilestone.index);
		logger(`${prefix}\t\tConfirmed Milestone Timestamp:`, info.status.confirmedMilestone.timestamp);
		logger(`${prefix}\t\tConfirmed Milestone Id:`, info.status.confirmedMilestone.milestoneId);
		logger(`${prefix}\t\tPruning Index:`, info.status.pruningIndex);
		logger(`${prefix}\tProtocol`);
		logger(`${prefix}\t\tNetwork Name:`, info.protocol.networkName);
		logger(`${prefix}\t\tBech32 HRP:`, info.protocol.bech32Hrp);
		logger(`${prefix}\t\tToken supply:`, info.protocol.tokenSupply);
		logger(`${prefix}\t\tProtocol version:`, info.protocol.protocolVersion);
		logger(`${prefix}\t\tMin PoW Score:`, info.protocol.minPowScore);
		logger(`${prefix}\t\tRent`);
		logger(`${prefix}\t\t\tVByte Cost:`, info.protocol.rentStructure.vByteCost);
		logger(`${prefix}\t\t\tVByte Factor Data:`, info.protocol.rentStructure.vByteFactorData);
		logger(`${prefix}\t\t\tVByte Factor Key:`, info.protocol.rentStructure.vByteFactorKey);
		logger(`${prefix}\tBase token`);
		logger(`${prefix}\t\tName:`, info.baseToken.name);
		logger(`${prefix}\t\tTicker Symbol:`, info.baseToken.tickerSymbol);
		logger(`${prefix}\t\tUnit:`, info.baseToken.unit);
		if (info.baseToken.subunit) {
			logger(`${prefix}\t\tSub unit:`, info.baseToken.subunit);
		}
		logger(`${prefix}\t\tDecimals:`, info.baseToken.decimals);
		logger(`${prefix}\t\tUse metric prefix:`, info.baseToken.useMetricPrefix);
		logger(`${prefix}\tMetrics`);
		logger(`${prefix}\t\tBlocks Per Second:`, info.metrics.blocksPerSecond);
		logger(`${prefix}\t\tReferenced Blocks Per Second:`, info.metrics.referencedBlocksPerSecond);
		logger(`${prefix}\t\tReferenced Rate:`, info.metrics.referencedRate);
		logger(`${prefix}\tFeatures:`, info.features);
	}
	/**
	 * Log the tips information.
	 * @param prefix The prefix for the output.
	 * @param tipsResponse The tips to log.
	 */
	function logTips(prefix, tipsResponse) {
		if (tipsResponse.tips) {
			for (let i = 0; i < tipsResponse.tips.length; i++) {
				logger(`${prefix}\tTip ${i + 1} Block Id:`, tipsResponse.tips[i]);
			}
		}
	}
	/**
	 * Log a block to the console.
	 * @param prefix The prefix for the output.
	 * @param block The block to log.
	 */
	function logBlock(prefix, block) {
		logger(`${prefix}\tProtocol Version:`, block.protocolVersion);
		if (block.parents) {
			for (let i = 0; i < block.parents.length; i++) {
				logger(`${prefix}\tParent ${i + 1} Block Id:`, block.parents[i]);
			}
		}
		logPayload(`${prefix}\t`, block.payload);
		if (block.nonce !== undefined) {
			logger(`${prefix}\tNonce:`, block.nonce);
		}
	}
	/**
	 * Log the block metadata to the console.
	 * @param prefix The prefix for the output.
	 * @param blockMetadata The blockMetadata to log.
	 */
	function logBlockMetadata(prefix, blockMetadata) {
		logger(`${prefix}\tBlock Id:`, blockMetadata.blockId);
		if (blockMetadata.parents) {
			for (let i = 0; i < blockMetadata.parents.length; i++) {
				logger(`${prefix}\tParent ${i + 1} Block Id:`, blockMetadata.parents[i]);
			}
		}
		if (blockMetadata.isSolid !== undefined) {
			logger(`${prefix}\tIs Solid:`, blockMetadata.isSolid);
		}
		if (blockMetadata.milestoneIndex !== undefined) {
			logger(`${prefix}\tMilestone Index:`, blockMetadata.milestoneIndex);
		}
		if (blockMetadata.referencedByMilestoneIndex !== undefined) {
			logger(`${prefix}\tReferenced By Milestone Index:`, blockMetadata.referencedByMilestoneIndex);
		}
		logger(`${prefix}\tLedger Inclusion State:`, blockMetadata.ledgerInclusionState);
		if (blockMetadata.conflictReason !== undefined) {
			logger(`${prefix}\tConflict Reason:`, blockMetadata.conflictReason);
		}
		if (blockMetadata.shouldPromote !== undefined) {
			logger(`${prefix}\tShould Promote:`, blockMetadata.shouldPromote);
		}
		if (blockMetadata.shouldReattach !== undefined) {
			logger(`${prefix}\tShould Reattach:`, blockMetadata.shouldReattach);
		}
	}
	/**
	 * Log a block to the console.
	 * @param prefix The prefix for the output.
	 * @param payload The payload.
	 */
	function logPayload(prefix, payload) {
		if (payload) {
			if (payload.type === TRANSACTION_PAYLOAD_TYPE) {
				logTransactionPayload(prefix, payload);
			} else if (payload.type === MILESTONE_PAYLOAD_TYPE) {
				logMilestonePayload(prefix, payload);
			} else if (payload.type === TREASURY_TRANSACTION_PAYLOAD_TYPE) {
				logTreasuryTransactionPayload(prefix, payload);
			} else if (payload.type === TAGGED_DATA_PAYLOAD_TYPE) {
				logTaggedDataPayload(prefix, payload);
			}
		}
	}
	/**
	 * Log a transaction payload to the console.
	 * @param prefix The prefix for the output.
	 * @param payload The payload.
	 */
	function logTransactionPayload(prefix, payload) {
		if (payload) {
			logger(`${prefix}Transaction Payload`);
			if (payload.essence.type === TRANSACTION_ESSENCE_TYPE) {
				logger(`${prefix}\tNetwork Id:`, payload.essence.networkId);
				if (payload.essence.inputs) {
					logger(`${prefix}\tInputs:`, payload.essence.inputs.length);
					for (const input of payload.essence.inputs) {
						logInput(`${prefix}\t\t`, input);
					}
				}
				logger(`${prefix}\tInputs Commitment:`, payload.essence.inputsCommitment);
				if (payload.essence.outputs) {
					logger(`${prefix}\tOutputs:`, payload.essence.outputs.length);
					for (const output of payload.essence.outputs) {
						logOutput(`${prefix}\t\t`, output);
					}
				}
			}
			if (payload.unlocks) {
				logger(`${prefix}\tUnlocks:`, payload.unlocks.length);
				for (const unlock of payload.unlocks) {
					logUnlock(`${prefix}\t\t`, unlock);
				}
			}
		}
	}
	/**
	 * Log a tagged data payload to the console.
	 * @param prefix The prefix for the output.
	 * @param payload The payload.
	 */
	function logTaggedDataPayload(prefix, payload) {
		if (payload) {
			logger(`${prefix}Tagged Data Payload`);
			logger(`${prefix}\tTag:`, payload.tag ? util_js.Converter.hexToUtf8(payload.tag) : 'None');
			logger(`${prefix}\tData:`, payload.data ? util_js.Converter.hexToUtf8(payload.data) : 'None');
		}
	}
	/**
	 * Log a milestone payload to the console.
	 * @param prefix The prefix for the output.
	 * @param payload The payload.
	 */
	function logMilestonePayload(prefix, payload) {
		if (payload) {
			logger(`${prefix}Milestone Payload`);
			logger(`${prefix}\tIndex:`, payload.index);
			logger(`${prefix}\tTimestamp:`, payload.timestamp);
			logger(`${prefix}\tProtocol version:`, payload.protocolVersion);
			logger(`${prefix}\tPreviousMilestoneId:`, payload.previousMilestoneId);
			for (let i = 0; i < payload.parents.length; i++) {
				logger(`${prefix}\tParent ${i + 1}:`, payload.parents[i]);
			}
			logger(`${prefix}\tConfirmed Merkle Proof:`, payload.inclusionMerkleRoot);
			logger(`${prefix}\tApplied Merkle Proof:`, payload.appliedMerkleRoot);
			logger(`${prefix}\tMetadata:`, payload.metadata);
			logMilestoneOptions(`${prefix}\t`, payload.options);
			logger(`${prefix}\tSignatures:`, payload.signatures.length);
			for (const signature of payload.signatures) {
				logSignature(`${prefix}\t\t`, signature);
			}
		}
	}
	/**
	 * Log milestone options to the console.
	 * @param prefix The prefix for the output.
	 * @param milestoneOptions The milestone options.
	 */
	function logMilestoneOptions(prefix, milestoneOptions) {
		if (milestoneOptions) {
			logger(`${prefix}Milestone Options`);
			for (const milestoneOption of milestoneOptions) {
				logMilestoneOption(`${prefix}\t\t`, milestoneOption);
			}
		}
	}
	/**
	 * Log milestone option to the console.
	 * @param prefix The prefix for the output.
	 * @param milestoneOption The milestone option.
	 */
	function logMilestoneOption(prefix, milestoneOption) {
		if (milestoneOption.type === RECEIPT_MILESTONE_OPTION_TYPE) {
			logger(`${prefix}\tReceipt Milestone Option`);
			logReceiptMilestoneOption(`${prefix}\t\t`, milestoneOption);
		} else if (milestoneOption.type === PROTOCOL_PARAMETERS_MILESTONE_OPTION_TYPE) {
			logger(`${prefix}\tProtocol Params Milestone Option`);
			logProtocolParamsMilestoneOption(`${prefix}\t\t`, milestoneOption);
		}
	}
	/**
	 * Log a receipt milestone option to the console.
	 * @param prefix The prefix for the output.
	 * @param option The option.
	 */
	function logReceiptMilestoneOption(prefix, option) {
		if (option) {
			logger(`${prefix}Receipt Milestone Option`);
			logger(`${prefix}\tMigrated At:`, option.migratedAt);
			logger(`${prefix}\tFinal:`, option.final);
			logger(`${prefix}\tFunds:`, option.funds.length);
			for (const funds of option.funds) {
				logFunds(`${prefix}\t\t`, funds);
			}
			logTreasuryTransactionPayload(`${prefix}\t\t`, option.transaction);
		}
	}
	/**
	 * Log a protocol params milestone option to the console.
	 * @param prefix The prefix for the output.
	 * @param option The option.
	 */
	function logProtocolParamsMilestoneOption(prefix, option) {
		if (option) {
			logger(`${prefix}Protocol Params Milestone Option`);
			logger(`${prefix}\tTarget Milestone Index:`, option.targetMilestoneIndex);
			logger(`${prefix}\tProtocol Version:`, option.protocolVersion);
			logger(`${prefix}\tParameters:`, option.params);
		}
	}
	/**
	 * Log a treasury transaction payload to the console.
	 * @param prefix The prefix for the output.
	 * @param payload The payload.
	 */
	function logTreasuryTransactionPayload(prefix, payload) {
		if (payload) {
			logger(`${prefix}Treasury Transaction Payload`);
			logInput(prefix, payload.input);
			logOutput(prefix, payload.output);
		}
	}
	/**
	 * Log an address to the console.
	 * @param prefix The prefix for the output.
	 * @param address The address to log.
	 */
	function logAddress(prefix, address) {
		if ((address === null || address === void 0 ? void 0 : address.type) === ED25519_ADDRESS_TYPE) {
			logger(`${prefix}Ed25519 Address`);
			logger(`${prefix}\tPublic Key Hash:`, address.pubKeyHash);
		} else if ((address === null || address === void 0 ? void 0 : address.type) === ALIAS_ADDRESS_TYPE) {
			logger(`${prefix}Alias Address`);
			logger(`${prefix}\tAlias Id:`, address.aliasId);
		} else if ((address === null || address === void 0 ? void 0 : address.type) === NFT_ADDRESS_TYPE) {
			logger(`${prefix}NFT Address`);
			logger(`${prefix}\tNFT Id:`, address.nftId);
		}
	}
	/**
	 * Log signature to the console.
	 * @param prefix The prefix for the output.
	 * @param signature The signature to log.
	 */
	function logSignature(prefix, signature) {
		if ((signature === null || signature === void 0 ? void 0 : signature.type) === ED25519_SIGNATURE_TYPE) {
			logger(`${prefix}Ed25519 Signature`);
			logger(`${prefix}\tPublic Key:`, signature.publicKey);
			logger(`${prefix}\tSignature:`, signature.signature);
		}
	}
	/**
	 * Log input to the console.
	 * @param prefix The prefix for the output.
	 * @param input The input to log.
	 */
	function logInput(prefix, input) {
		if (input) {
			if (input.type === UTXO_INPUT_TYPE) {
				logger(`${prefix}UTXO Input`);
				logger(`${prefix}\tTransaction Id:`, input.transactionId);
				logger(`${prefix}\tTransaction Output Index:`, input.transactionOutputIndex);
			} else if (input.type === TREASURY_INPUT_TYPE) {
				logger(`${prefix}Treasury Input`);
				logger(`${prefix}\tMilestone Hash:`, input.milestoneId);
			}
		}
	}
	/**
	 * Log output to the console.
	 * @param prefix The prefix for the output.
	 * @param output The output to log.
	 */
	function logOutput(prefix, output) {
		if (output) {
			if (output.type === TREASURY_OUTPUT_TYPE) {
				logger(`${prefix}Treasury Output`);
				logger(`${prefix}\t\tAmount:`, output.amount);
			} else if (output.type === BASIC_OUTPUT_TYPE) {
				logger(`${prefix}Basic Output`);
				logger(`${prefix}\t\tAmount:`, output.amount);
				logNativeTokens(`${prefix}\t\t`, output.nativeTokens);
				logUnlockConditions(`${prefix}\t\t`, output.unlockConditions);
				logFeatures(`${prefix}\t\t`, output.features);
			} else if (output.type === ALIAS_OUTPUT_TYPE) {
				logger(`${prefix}Alias Output`);
				logger(`${prefix}\t\tAmount:`, output.amount);
				logNativeTokens(`${prefix}\t\t`, output.nativeTokens);
				logger(`${prefix}\t\tAlias Id:`, output.aliasId);
				logger(`${prefix}\t\tState Index:`, output.stateIndex);
				logger(`${prefix}\t\tState Metadata:`, output.stateMetadata);
				logger(`${prefix}\t\tFoundry Counter:`, output.foundryCounter);
				logUnlockConditions(`${prefix}\t\t`, output.unlockConditions);
				logFeatures(`${prefix}\t\t`, output.features);
				logImmutableFeatures(`${prefix}\t\t`, output.immutableFeatures);
			} else if (output.type === FOUNDRY_OUTPUT_TYPE) {
				logger(`${prefix}Foundry Output`);
				logger(`${prefix}\t\tAmount:`, output.amount);
				logNativeTokens(`${prefix}\t\t`, output.nativeTokens);
				logger(`${prefix}\t\tSerial Number:`, output.serialNumber);
				logTokenScheme(`${prefix}\t\t`, output.tokenScheme);
				logUnlockConditions(`${prefix}\t\t`, output.unlockConditions);
				logFeatures(`${prefix}\t\t`, output.features);
				logImmutableFeatures(`${prefix}\t\t`, output.immutableFeatures);
			} else if (output.type === NFT_OUTPUT_TYPE) {
				logger(`${prefix}NFT Output`);
				logger(`${prefix}\t\tAmount:`, output.amount);
				logNativeTokens(`${prefix}\t\t`, output.nativeTokens);
				logger(`${prefix}\t\tNFT Id:`, output.nftId);
				logUnlockConditions(`${prefix}\t\t`, output.unlockConditions);
				logFeatures(`${prefix}\t\t`, output.features);
				logImmutableFeatures(`${prefix}\t\t`, output.immutableFeatures);
			}
		}
	}
	/**
	 * Log unlock to the console.
	 * @param prefix The prefix for the output.
	 * @param unlock The unlock to log.
	 */
	function logUnlock(prefix, unlock) {
		if (unlock) {
			if (unlock.type === SIGNATURE_UNLOCK_TYPE) {
				logger(`${prefix}\tSignature Unlock`);
				logSignature(`${prefix}\t\t`, unlock.signature);
			} else if (unlock.type === REFERENCE_UNLOCK_TYPE) {
				logger(`${prefix}\tReference Unlock`);
				logger(`${prefix}\t\tReference:`, unlock.reference);
			} else if (unlock.type === ALIAS_UNLOCK_TYPE) {
				logger(`${prefix}\tAlias Unlock`);
				logger(`${prefix}\t\tReference:`, unlock.reference);
			} else if (unlock.type === NFT_UNLOCK_TYPE) {
				logger(`${prefix}\tNFT Unlock`);
				logger(`${prefix}\t\tReference:`, unlock.reference);
			}
		}
	}
	/**
	 * Log fund to the console.
	 * @param prefix The prefix for the output.
	 * @param fund The fund to log.
	 */
	function logFunds(prefix, fund) {
		if (fund) {
			logger(`${prefix}\tFund`);
			logger(`${prefix}\t\tTail Transaction Hash:`, fund.tailTransactionHash);
			logAddress(`${prefix}\t\t`, fund.address);
			logger(`${prefix}\t\tDeposit:`, fund.deposit);
		}
	}
	/**
	 * Log native tokens to the console.
	 * @param prefix The prefix for the output.
	 * @param nativeTokens The native tokens.
	 */
	function logNativeTokens(prefix, nativeTokens) {
		logger(`${prefix}Native Tokens`);
		for (const nativeToken of nativeTokens !== null && nativeTokens !== void 0 ? nativeTokens : []) {
			logger(`${prefix}\t\tId:`, nativeToken.id);
			logger(`${prefix}\t\tAmount:`, nativeToken.amount);
		}
	}
	/**
	 * Log token scheme to the console.
	 * @param prefix The prefix for the output.
	 * @param tokenScheme The token scheme.
	 */
	function logTokenScheme(prefix, tokenScheme) {
		if (tokenScheme.type === SIMPLE_TOKEN_SCHEME_TYPE) {
			logger(`${prefix}\tSimple Token Scheme`);
			logger(`${prefix}\t\tMinted Tokens:`, tokenScheme.mintedTokens);
			logger(`${prefix}\t\tMelted Tokens:`, tokenScheme.meltedTokens);
			logger(`${prefix}\t\tMaximum Supply:`, tokenScheme.maximumSupply);
		}
	}
	/**
	 * Log featurew to the console.
	 * @param prefix The prefix for the output.
	 * @param features The features.
	 */
	function logFeatures(prefix, features) {
		logger(`${prefix}Features`);
		for (const feature of features !== null && features !== void 0 ? features : []) {
			logFeature(`${prefix}\t\t`, feature);
		}
	}
	/**
	 * Log immutable featuress to the console.
	 * @param prefix The prefix for the output.
	 * @param immutableFeatures The features.
	 */
	function logImmutableFeatures(prefix, immutableFeatures) {
		logger(`${prefix}Immutable Features`);
		for (const feature of immutableFeatures !== null && immutableFeatures !== void 0 ? immutableFeatures : []) {
			logFeature(`${prefix}\t\t`, feature);
		}
	}
	/**
	 * Log feature to the console.
	 * @param prefix The prefix for the output.
	 * @param feature The feature.
	 */
	function logFeature(prefix, feature) {
		if (feature.type === SENDER_FEATURE_TYPE) {
			logger(`${prefix}\tSender Feature`);
			logAddress(`${prefix}\t\t`, feature.address);
		} else if (feature.type === ISSUER_FEATURE_TYPE) {
			logger(`${prefix}\tIssuer Feature`);
			logAddress(`${prefix}\t\t`, feature.address);
		} else if (feature.type === METADATA_FEATURE_TYPE) {
			logger(`${prefix}\tMetadata Feature`);
			logger(`${prefix}\t\tData:`, feature.data);
		} else if (feature.type === TAG_FEATURE_TYPE) {
			logger(`${prefix}\tTag Feature`);
			logger(`${prefix}\t\tTag:`, feature.tag);
		}
	}
	/**
	 * Log unlock conditions to the console.
	 * @param prefix The prefix for the output.
	 * @param unlockConditions The unlock conditions.
	 */
	function logUnlockConditions(prefix, unlockConditions) {
		logger(`${prefix}Unlock Conditions`);
		for (const unlockCondition of unlockConditions) {
			logUnlockCondition(`${prefix}\t\t`, unlockCondition);
		}
	}
	/**
	 * Log feature block to the console.
	 * @param prefix The prefix for the output.
	 * @param unlockCondition The unlock condition.
	 */
	function logUnlockCondition(prefix, unlockCondition) {
		if (unlockCondition.type === ADDRESS_UNLOCK_CONDITION_TYPE) {
			logger(`${prefix}\tAddress Unlock Condition`);
			logAddress(`${prefix}\t\t`, unlockCondition.address);
		} else if (unlockCondition.type === STORAGE_DEPOSIT_RETURN_UNLOCK_CONDITION_TYPE) {
			logger(`${prefix}\tStorage Deposit Return Unlock Condition`);
			logAddress(`${prefix}\t\t`, unlockCondition.returnAddress);
			logger(`${prefix}\t\tAmount:`, unlockCondition.amount);
		} else if (unlockCondition.type === TIMELOCK_UNLOCK_CONDITION_TYPE) {
			logger(`${prefix}\tTimelock Unlock Condition`);
			logger(`${prefix}\t\tUnixTime:`, unlockCondition.unixTime);
		} else if (unlockCondition.type === EXPIRATION_UNLOCK_CONDITION_TYPE) {
			logger(`${prefix}\tExpiration Unlock Condition`);
			logAddress(`${prefix}\t\t`, unlockCondition.returnAddress);
			logger(`${prefix}\t\tUnixTime:`, unlockCondition.unixTime);
		} else if (unlockCondition.type === STATE_CONTROLLER_ADDRESS_UNLOCK_CONDITION_TYPE) {
			logger(`${prefix}\tState Controller Address Unlock Condition`);
			logAddress(`${prefix}\t\t`, unlockCondition.address);
		} else if (unlockCondition.type === GOVERNOR_ADDRESS_UNLOCK_CONDITION_TYPE) {
			logger(`${prefix}\tGovernor Address Unlock Condition`);
			logAddress(`${prefix}\t\t`, unlockCondition.address);
		} else if (unlockCondition.type === IMMUTABLE_ALIAS_UNLOCK_CONDITION_TYPE) {
			logger(`${prefix}\tImmutable Alias Unlock Condition`);
			logAddress(`${prefix}\t\t`, unlockCondition.address);
		}
	}

	// Copyright 2020 IOTA Stiftung
	/**
	 * Helper methods for Transactions.
	 */
	class TransactionHelper {
		/**
		 * Calculate blockId from a block.
		 * @param block The block.
		 * @returns The blockId.
		 */
		static calculateBlockId(block) {
			const writeStream = new util_js.WriteStream();
			serializeBlock(writeStream, block);
			const blockBytes = writeStream.finalBytes();
			return util_js.Converter.bytesToHex(crypto_js.Blake2b.sum256(blockBytes), true);
		}
		/**
		 * Returns the outputId from transation id and output index.
		 * @param transactionId The id of the transaction.
		 * @param outputIndex The index of the output.
		 * @returns The output id.
		 */
		static outputIdFromTransactionData(transactionId, outputIndex) {
			const writeStream = new util_js.WriteStream();
			writeStream.writeFixedHex('transactionId', TRANSACTION_ID_LENGTH, transactionId);
			writeStream.writeUInt16('outputIndex', outputIndex);
			const outputIdBytes = writeStream.finalBytes();
			return util_js.Converter.bytesToHex(outputIdBytes, true);
		}
		/**
		 * Calculate the Transaction Essence hash.
		 * @param essence The transaction essence.
		 * @returns The transaction essence hash.
		 */
		static getTransactionEssenceHash(essence) {
			const writeStream = new util_js.WriteStream();
			serializeTransactionEssence(writeStream, essence);
			const essenceFinal = writeStream.finalBytes();
			return crypto_js.Blake2b.sum256(essenceFinal);
		}
		/**
		 * Calculate the Transaction hash.
		 * @param transactionPayload The payload of the transaction.
		 * @returns The transaction hash.
		 */
		static getTransactionPayloadHash(transactionPayload) {
			const writeStream = new util_js.WriteStream();
			serializeTransactionPayload(writeStream, transactionPayload);
			const txBytes = writeStream.finalBytes();
			return crypto_js.Blake2b.sum256(txBytes);
		}
		/**
		 * Calculate the UTXO input from an output Id.
		 * @param outputId The id of the output.
		 * @returns The UTXO Input.
		 */
		static inputFromOutputId(outputId) {
			const readStream = new util_js.ReadStream(util_js.Converter.hexToBytes(outputId));
			const input = {
				type: UTXO_INPUT_TYPE,
				transactionId: readStream.readFixedHex('transactionId', TRANSACTION_ID_LENGTH),
				transactionOutputIndex: readStream.readUInt16('outputIndex')
			};
			return input;
		}
		/**
		 * Calculate the inputCommitment from the output objects that are used as inputs to fund the transaction.
		 * @param inputs The output objects used as inputs for the transaction.
		 * @returns The inputs commitment.
		 */
		static getInputsCommitment(inputs) {
			const inputsCommitmentHasher = new crypto_js.Blake2b(crypto_js.Blake2b.SIZE_256); // blake2b hasher
			for (let i = 0; i < inputs.length; i++) {
				const writeStream = new util_js.WriteStream();
				serializeOutput(writeStream, inputs[i]);
				inputsCommitmentHasher.update(crypto_js.Blake2b.sum256(writeStream.finalBytes()));
			}
			return util_js.Converter.bytesToHex(inputsCommitmentHasher.final(), true);
		}
		/**
		 * Calculates the required storage deposit of an output.
		 * @param output The output.
		 * @param rentStructure Rent cost of objects which take node resources.
		 * @returns The required storage deposit.
		 */
		static getStorageDeposit(output, rentStructure) {
			const writeStream = new util_js.WriteStream();
			serializeOutput(writeStream, output);
			const outputBytes = writeStream.finalBytes();
			const offset =
				rentStructure.vByteFactorKey * TransactionHelper.OUTPUT_ID_LENGTH +
				rentStructure.vByteFactorData *
					(BLOCK_ID_LENGTH +
						TransactionHelper.CONFIRMED_MILESTONE_INDEX_LENGTH +
						TransactionHelper.CONFIRMED_UINIX_TIMESTAMP_LENGTH);
			const vByteSize = rentStructure.vByteFactorData * outputBytes.length + offset;
			return rentStructure.vByteCost * vByteSize;
		}
		/**
		 * Returns the nftId/aliasId from an outputId.
		 * NftId/aliasId is Blake2b-256 hash of the outputId that created it.
		 * @param outputId The id of the output.
		 * @returns The resolved Nft id or Alias id.
		 */
		static resolveIdFromOutputId(outputId) {
			return util_js.Converter.bytesToHex(crypto_js.Blake2b.sum256(util_js.Converter.hexToBytes(outputId)), true);
		}
		/**
		 * Constructs a tokenId from the aliasId, serial number and token scheme type.
		 * @param aliasId The alias Id of the alias that controls the foundry.
		 * @param serialNumber The serial number of the foundry.
		 * @param tokenSchemeType The tokenSchemeType of the foundry.
		 * @returns The tokenId.
		 */
		static constructTokenId(aliasId, serialNumber, tokenSchemeType) {
			const wsAddress = new util_js.WriteStream();
			serializeAliasAddress(wsAddress, {
				type: ALIAS_ADDRESS_TYPE,
				aliasId
			});
			const aliasAddressBytes = wsAddress.finalBytes();
			const wsSerialNumber = new util_js.WriteStream();
			wsSerialNumber.writeUInt32('serialNumber', serialNumber);
			const serialNumberBytes = wsSerialNumber.finalBytes();
			const wsToken = new util_js.WriteStream();
			wsToken.writeUInt8('tokenSchemeType', tokenSchemeType);
			const tokenSchemeTypeBytes = wsToken.finalBytes();
			const tokenIdBytes = [...aliasAddressBytes, ...serialNumberBytes, ...tokenSchemeTypeBytes];
			return util_js.Converter.bytesToHex(new Uint8Array(tokenIdBytes), true);
		}
		/**
		 * Calculates the networkId value from the network name.
		 * @param networkName The name of the network.
		 * @returns The networkId.
		 */
		static networkIdFromNetworkName(networkName) {
			const networkIdBytes = crypto_js.Blake2b.sum256(util_js.Converter.utf8ToBytes(networkName));
			return util_js.BigIntHelper.read8(networkIdBytes, 0).toString();
		}
	}
	/**
	 * The confirmed milestone index length.
	 */
	TransactionHelper.CONFIRMED_MILESTONE_INDEX_LENGTH = 4;
	/**
	 * The confirmed unix timestamp length.
	 */
	TransactionHelper.CONFIRMED_UINIX_TIMESTAMP_LENGTH = 4;
	/**
	 * The output Id length.
	 */
	TransactionHelper.OUTPUT_ID_LENGTH = 34;

	/**
	 * Class to help with units formatting.
	 */
	class UnitsHelper {
		/**
		 * Format the value in the best units.
		 * @param value The value to format.
		 * @param decimalPlaces The number of decimal places to display.
		 * @returns The formated value.
		 */
		static formatBest(value, decimalPlaces = 2) {
			return UnitsHelper.formatUnits(value, UnitsHelper.calculateBest(value), decimalPlaces);
		}
		/**
		 * Format the value in the best units.
		 * @param value The value to format.
		 * @param magnitude The magnitude to format with.
		 * @param decimalPlaces The number of decimal places to display.
		 * @returns The formated value.
		 */
		static formatUnits(value, magnitude, decimalPlaces = 2) {
			if (!UnitsHelper.MAGNITUDE_MAP[magnitude]) {
				throw new Error(`Unrecognized magnitude ${magnitude}`);
			}
			if (!value) {
				return '0';
			}
			return magnitude === ''
				? `${value}`
				: `${UnitsHelper.convertUnits(value, '', magnitude).toFixed(decimalPlaces)} ${magnitude}`;
		}
		/**
		 * Format the value in the best units.
		 * @param value The value to format.
		 * @returns The best units for the value.
		 */
		static calculateBest(value) {
			let bestUnits = '';
			if (!value) {
				return bestUnits;
			}
			const checkLength = Math.abs(value).toString().length;
			if (checkLength > UnitsHelper.MAGNITUDE_MAP.P.dp) {
				bestUnits = 'P';
			} else if (checkLength > UnitsHelper.MAGNITUDE_MAP.T.dp) {
				bestUnits = 'T';
			} else if (checkLength > UnitsHelper.MAGNITUDE_MAP.G.dp) {
				bestUnits = 'G';
			} else if (checkLength > UnitsHelper.MAGNITUDE_MAP.M.dp) {
				bestUnits = 'M';
			} else if (checkLength > UnitsHelper.MAGNITUDE_MAP.K.dp) {
				bestUnits = 'K';
			}
			return bestUnits;
		}
		/**
		 * Convert the value to different units.
		 * @param value The value to convert.
		 * @param from The from magnitude.
		 * @param to The to magnitude.
		 * @returns The formatted unit.
		 */
		static convertUnits(value, from, to) {
			if (!value) {
				return 0;
			}
			if (!UnitsHelper.MAGNITUDE_MAP[from]) {
				throw new Error(`Unrecognized fromUnit ${from}`);
			}
			if (!UnitsHelper.MAGNITUDE_MAP[to]) {
				throw new Error(`Unrecognized toUnit ${to}`);
			}
			if (from === to) {
				return Number(value);
			}
			const multiplier = value < 0 ? -1 : 1;
			const scaledValue =
				(Math.abs(Number(value)) * UnitsHelper.MAGNITUDE_MAP[from].val) / UnitsHelper.MAGNITUDE_MAP[to].val;
			const numDecimals = UnitsHelper.MAGNITUDE_MAP[to].dp;
			// We cant use toFixed to just convert the new value to a string with
			// fixed decimal places as it will round, which we don't want
			// instead we want to convert the value to a string and manually
			// truncate the number of digits after the decimal
			// Unfortunately large numbers end up in scientific notation with
			// the regular toString() so we use a custom conversion.
			let fixed = scaledValue.toString();
			if (fixed.includes('e')) {
				fixed = scaledValue.toFixed(Number.parseInt(fixed.split('-')[1], 10));
			}
			// Now we have the number as a full string we can split it into
			// whole and decimals parts
			const parts = fixed.split('.');
			if (parts.length === 1) {
				parts.push('0');
			}
			// Now truncate the decimals by the number allowed on the toUnit
			parts[1] = parts[1].slice(0, numDecimals);
			// Finally join the parts and convert back to a real number
			return Number.parseFloat(`${parts[0]}.${parts[1]}`) * multiplier;
		}
	}
	/**
	 * Map units.
	 */
	UnitsHelper.MAGNITUDE_MAP = {
		'': { val: 1, dp: 0 },
		K: { val: 1000, dp: 3 },
		M: { val: 1000000, dp: 6 },
		G: { val: 1000000000, dp: 9 },
		T: { val: 1000000000000, dp: 12 },
		P: { val: 1000000000000000, dp: 15 }
	};

	exports.ADDRESS_UNLOCK_CONDITION_TYPE = ADDRESS_UNLOCK_CONDITION_TYPE;
	exports.ALIAS_ADDRESS_TYPE = ALIAS_ADDRESS_TYPE;
	exports.ALIAS_ID_LENGTH = ALIAS_ID_LENGTH;
	exports.ALIAS_OUTPUT_TYPE = ALIAS_OUTPUT_TYPE;
	exports.ALIAS_UNLOCK_TYPE = ALIAS_UNLOCK_TYPE;
	exports.ARRAY_LENGTH = ARRAY_LENGTH;
	exports.B1T6 = B1T6;
	exports.BASIC_OUTPUT_TYPE = BASIC_OUTPUT_TYPE;
	exports.BLOCK_ID_LENGTH = BLOCK_ID_LENGTH;
	exports.Bech32Helper = Bech32Helper;
	exports.CONFLICT_REASON_STRINGS = CONFLICT_REASON_STRINGS;
	exports.ClientError = ClientError;
	exports.DEFAULT_PROTOCOL_VERSION = DEFAULT_PROTOCOL_VERSION;
	exports.ED25519_ADDRESS_TYPE = ED25519_ADDRESS_TYPE;
	exports.ED25519_SEED_TYPE = ED25519_SEED_TYPE;
	exports.ED25519_SIGNATURE_TYPE = ED25519_SIGNATURE_TYPE;
	exports.EXPIRATION_UNLOCK_CONDITION_TYPE = EXPIRATION_UNLOCK_CONDITION_TYPE;
	exports.Ed25519Address = Ed25519Address;
	exports.Ed25519Seed = Ed25519Seed;
	exports.FOUNDRY_OUTPUT_TYPE = FOUNDRY_OUTPUT_TYPE;
	exports.GOVERNOR_ADDRESS_UNLOCK_CONDITION_TYPE = GOVERNOR_ADDRESS_UNLOCK_CONDITION_TYPE;
	exports.IMMUTABLE_ALIAS_UNLOCK_CONDITION_TYPE = IMMUTABLE_ALIAS_UNLOCK_CONDITION_TYPE;
	exports.INPUTS_COMMITMENT_SIZE = INPUTS_COMMITMENT_SIZE;
	exports.IOTA_BIP44_BASE_PATH = IOTA_BIP44_BASE_PATH;
	exports.setIotaBip44BasePath = setIotaBip44BasePath;
	exports.ISSUER_FEATURE_TYPE = ISSUER_FEATURE_TYPE;
	exports.IndexerPluginClient = IndexerPluginClient;
	exports.LocalPowProvider = LocalPowProvider;
	exports.MAX_BLOCK_LENGTH = MAX_BLOCK_LENGTH;
	exports.MAX_FUNDS_COUNT = MAX_FUNDS_COUNT;
	exports.MAX_INPUT_COUNT = MAX_INPUT_COUNT;
	exports.MAX_NUMBER_PARENTS = MAX_NUMBER_PARENTS;
	exports.MAX_OUTPUT_COUNT = MAX_OUTPUT_COUNT;
	exports.MAX_TAG_LENGTH = MAX_TAG_LENGTH;
	exports.MERKLE_PROOF_LENGTH = MERKLE_PROOF_LENGTH;
	exports.METADATA_FEATURE_TYPE = METADATA_FEATURE_TYPE;
	exports.MILESTONE_PAYLOAD_TYPE = MILESTONE_PAYLOAD_TYPE;
	exports.MIN_ADDRESS_LENGTH = MIN_ADDRESS_LENGTH;
	exports.MIN_ADDRESS_UNLOCK_CONDITION_LENGTH = MIN_ADDRESS_UNLOCK_CONDITION_LENGTH;
	exports.MIN_ALIAS_ADDRESS_LENGTH = MIN_ALIAS_ADDRESS_LENGTH;
	exports.MIN_ALIAS_OUTPUT_LENGTH = MIN_ALIAS_OUTPUT_LENGTH;
	exports.MIN_ALIAS_UNLOCK_LENGTH = MIN_ALIAS_UNLOCK_LENGTH;
	exports.MIN_BASIC_OUTPUT_LENGTH = MIN_BASIC_OUTPUT_LENGTH;
	exports.MIN_ED25519_ADDRESS_LENGTH = MIN_ED25519_ADDRESS_LENGTH;
	exports.MIN_ED25519_SIGNATURE_LENGTH = MIN_ED25519_SIGNATURE_LENGTH;
	exports.MIN_EXPIRATION_UNLOCK_CONDITION_LENGTH = MIN_EXPIRATION_UNLOCK_CONDITION_LENGTH;
	exports.MIN_FEATURES_LENGTH = MIN_FEATURES_LENGTH;
	exports.MIN_FEATURE_LENGTH = MIN_FEATURE_LENGTH;
	exports.MIN_FOUNDRY_OUTPUT_LENGTH = MIN_FOUNDRY_OUTPUT_LENGTH;
	exports.MIN_GOVERNOR_ADDRESS_UNLOCK_CONDITION_LENGTH = MIN_GOVERNOR_ADDRESS_UNLOCK_CONDITION_LENGTH;
	exports.MIN_IMMUTABLE_ALIAS_UNLOCK_CONDITION_LENGTH = MIN_IMMUTABLE_ALIAS_UNLOCK_CONDITION_LENGTH;
	exports.MIN_INPUT_COUNT = MIN_INPUT_COUNT;
	exports.MIN_INPUT_LENGTH = MIN_INPUT_LENGTH;
	exports.MIN_ISSUER_FEATURE_LENGTH = MIN_ISSUER_FEATURE_LENGTH;
	exports.MIN_METADATA_FEATURE_LENGTH = MIN_METADATA_FEATURE_LENGTH;
	exports.MIN_MIGRATED_FUNDS_LENGTH = MIN_MIGRATED_FUNDS_LENGTH;
	exports.MIN_MILESTONE_OPTION_LENGTH = MIN_MILESTONE_OPTION_LENGTH;
	exports.MIN_MILESTONE_PAYLOAD_LENGTH = MIN_MILESTONE_PAYLOAD_LENGTH;
	exports.MIN_NFT_ADDRESS_LENGTH = MIN_NFT_ADDRESS_LENGTH;
	exports.MIN_NFT_OUTPUT_LENGTH = MIN_NFT_OUTPUT_LENGTH;
	exports.MIN_NFT_UNLOCK_LENGTH = MIN_NFT_UNLOCK_LENGTH;
	exports.MIN_NUMBER_PARENTS = MIN_NUMBER_PARENTS;
	exports.MIN_OUTPUT_COUNT = MIN_OUTPUT_COUNT;
	exports.MIN_OUTPUT_LENGTH = MIN_OUTPUT_LENGTH;
	exports.MIN_PAYLOAD_LENGTH = MIN_PAYLOAD_LENGTH;
	exports.MIN_PROTOCOL_PARAMS_MILESTONE_OPTION_LENGTH = MIN_PROTOCOL_PARAMS_MILESTONE_OPTION_LENGTH;
	exports.MIN_RECEIPT_MILESTONE_OPTION_LENGTH = MIN_RECEIPT_MILESTONE_OPTION_LENGTH;
	exports.MIN_REFERENCE_UNLOCK_LENGTH = MIN_REFERENCE_UNLOCK_LENGTH;
	exports.MIN_SENDER_FEATURE_LENGTH = MIN_SENDER_FEATURE_LENGTH;
	exports.MIN_SIGNATURE_LENGTH = MIN_SIGNATURE_LENGTH;
	exports.MIN_SIGNATURE_UNLOCK_LENGTH = MIN_SIGNATURE_UNLOCK_LENGTH;
	exports.MIN_SIMPLE_TOKEN_SCHEME_LENGTH = MIN_SIMPLE_TOKEN_SCHEME_LENGTH;
	exports.MIN_STATE_CONTROLLER_ADDRESS_UNLOCK_CONDITION_LENGTH = MIN_STATE_CONTROLLER_ADDRESS_UNLOCK_CONDITION_LENGTH;
	exports.MIN_STORAGE_DEPOSIT_RETURN_UNLOCK_CONDITION_LENGTH = MIN_STORAGE_DEPOSIT_RETURN_UNLOCK_CONDITION_LENGTH;
	exports.MIN_TAGGED_DATA_PAYLOAD_LENGTH = MIN_TAGGED_DATA_PAYLOAD_LENGTH;
	exports.MIN_TAG_FEATURE_LENGTH = MIN_TAG_FEATURE_LENGTH;
	exports.MIN_TIMELOCK_UNLOCK_CONDITION_LENGTH = MIN_TIMELOCK_UNLOCK_CONDITION_LENGTH;
	exports.MIN_TOKEN_SCHEME_LENGTH = MIN_TOKEN_SCHEME_LENGTH;
	exports.MIN_TRANSACTION_ESSENCE_LENGTH = MIN_TRANSACTION_ESSENCE_LENGTH;
	exports.MIN_TRANSACTION_PAYLOAD_LENGTH = MIN_TRANSACTION_PAYLOAD_LENGTH;
	exports.MIN_TREASURY_INPUT_LENGTH = MIN_TREASURY_INPUT_LENGTH;
	exports.MIN_TREASURY_OUTPUT_LENGTH = MIN_TREASURY_OUTPUT_LENGTH;
	exports.MIN_TREASURY_TRANSACTION_PAYLOAD_LENGTH = MIN_TREASURY_TRANSACTION_PAYLOAD_LENGTH;
	exports.MIN_UNLOCK_CONDITIONS_LENGTH = MIN_UNLOCK_CONDITIONS_LENGTH;
	exports.MIN_UNLOCK_CONDITION_LENGTH = MIN_UNLOCK_CONDITION_LENGTH;
	exports.MIN_UNLOCK_LENGTH = MIN_UNLOCK_LENGTH;
	exports.MIN_UTXO_INPUT_LENGTH = MIN_UTXO_INPUT_LENGTH;
	exports.NFT_ADDRESS_TYPE = NFT_ADDRESS_TYPE;
	exports.NFT_ID_LENGTH = NFT_ID_LENGTH;
	exports.NFT_OUTPUT_TYPE = NFT_OUTPUT_TYPE;
	exports.NFT_UNLOCK_TYPE = NFT_UNLOCK_TYPE;
	exports.PROTOCOL_PARAMETERS_MILESTONE_OPTION_TYPE = PROTOCOL_PARAMETERS_MILESTONE_OPTION_TYPE;
	exports.PowHelper = PowHelper;
	exports.RECEIPT_MILESTONE_OPTION_TYPE = RECEIPT_MILESTONE_OPTION_TYPE;
	exports.REFERENCE_UNLOCK_TYPE = REFERENCE_UNLOCK_TYPE;
	exports.SENDER_FEATURE_TYPE = SENDER_FEATURE_TYPE;
	exports.SIGNATURE_UNLOCK_TYPE = SIGNATURE_UNLOCK_TYPE;
	exports.SIMPLE_TOKEN_SCHEME_TYPE = SIMPLE_TOKEN_SCHEME_TYPE;
	exports.SMALL_TYPE_LENGTH = SMALL_TYPE_LENGTH;
	exports.STATE_CONTROLLER_ADDRESS_UNLOCK_CONDITION_TYPE = STATE_CONTROLLER_ADDRESS_UNLOCK_CONDITION_TYPE;
	exports.STORAGE_DEPOSIT_RETURN_UNLOCK_CONDITION_TYPE = STORAGE_DEPOSIT_RETURN_UNLOCK_CONDITION_TYPE;
	exports.STRING_LENGTH = STRING_LENGTH;
	exports.SingleNodeClient = SingleNodeClient;
	exports.TAGGED_DATA_PAYLOAD_TYPE = TAGGED_DATA_PAYLOAD_TYPE;
	exports.TAG_FEATURE_TYPE = TAG_FEATURE_TYPE;
	exports.TAIL_HASH_LENGTH = TAIL_HASH_LENGTH;
	exports.TIMELOCK_UNLOCK_CONDITION_TYPE = TIMELOCK_UNLOCK_CONDITION_TYPE;
	exports.TRANSACTION_ESSENCE_TYPE = TRANSACTION_ESSENCE_TYPE;
	exports.TRANSACTION_ID_LENGTH = TRANSACTION_ID_LENGTH;
	exports.TRANSACTION_PAYLOAD_TYPE = TRANSACTION_PAYLOAD_TYPE;
	exports.TREASURY_INPUT_TYPE = TREASURY_INPUT_TYPE;
	exports.TREASURY_OUTPUT_TYPE = TREASURY_OUTPUT_TYPE;
	exports.TREASURY_TRANSACTION_PAYLOAD_TYPE = TREASURY_TRANSACTION_PAYLOAD_TYPE;
	exports.TYPE_LENGTH = TYPE_LENGTH;
	exports.TransactionHelper = TransactionHelper;
	exports.UINT16_SIZE = UINT16_SIZE;
	exports.UINT256_SIZE = UINT256_SIZE;
	exports.UINT32_SIZE = UINT32_SIZE;
	exports.UINT64_SIZE = UINT64_SIZE;
	exports.UINT8_SIZE = UINT8_SIZE;
	exports.UTXO_INPUT_TYPE = UTXO_INPUT_TYPE;
	exports.UnitsHelper = UnitsHelper;
	exports.addressBalance = addressBalance;
	exports.blockIdFromMilestonePayload = blockIdFromMilestonePayload;
	exports.buildTransactionPayload = buildTransactionPayload;
	exports.calculateInputs = calculateInputs;
	exports.deserializeAddress = deserializeAddress;
	exports.deserializeAddressUnlockCondition = deserializeAddressUnlockCondition;
	exports.deserializeAliasAddress = deserializeAliasAddress;
	exports.deserializeAliasOutput = deserializeAliasOutput;
	exports.deserializeAliasUnlock = deserializeAliasUnlock;
	exports.deserializeBasicOutput = deserializeBasicOutput;
	exports.deserializeBlock = deserializeBlock;
	exports.deserializeEd25519Address = deserializeEd25519Address;
	exports.deserializeEd25519Signature = deserializeEd25519Signature;
	exports.deserializeExpirationUnlockCondition = deserializeExpirationUnlockCondition;
	exports.deserializeFeature = deserializeFeature;
	exports.deserializeFeatures = deserializeFeatures;
	exports.deserializeFoundryOutput = deserializeFoundryOutput;
	exports.deserializeFunds = deserializeFunds;
	exports.deserializeGovernorAddressUnlockCondition = deserializeGovernorAddressUnlockCondition;
	exports.deserializeImmutableAliasUnlockCondition = deserializeImmutableAliasUnlockCondition;
	exports.deserializeInput = deserializeInput;
	exports.deserializeInputs = deserializeInputs;
	exports.deserializeIssuerFeature = deserializeIssuerFeature;
	exports.deserializeMetadataFeature = deserializeMetadataFeature;
	exports.deserializeMigratedFunds = deserializeMigratedFunds;
	exports.deserializeMilestoneOption = deserializeMilestoneOption;
	exports.deserializeMilestoneOptions = deserializeMilestoneOptions;
	exports.deserializeMilestonePayload = deserializeMilestonePayload;
	exports.deserializeNftAddress = deserializeNftAddress;
	exports.deserializeNftOutput = deserializeNftOutput;
	exports.deserializeNftUnlock = deserializeNftUnlock;
	exports.deserializeOutput = deserializeOutput;
	exports.deserializeOutputs = deserializeOutputs;
	exports.deserializePayload = deserializePayload;
	exports.deserializeProtocolParamsMilestoneOption = deserializeProtocolParamsMilestoneOption;
	exports.deserializeReceiptMilestoneOption = deserializeReceiptMilestoneOption;
	exports.deserializeReferenceUnlock = deserializeReferenceUnlock;
	exports.deserializeSenderFeature = deserializeSenderFeature;
	exports.deserializeSignature = deserializeSignature;
	exports.deserializeSignatureUnlock = deserializeSignatureUnlock;
	exports.deserializeSimpleTokenScheme = deserializeSimpleTokenScheme;
	exports.deserializeStateControllerAddressUnlockCondition = deserializeStateControllerAddressUnlockCondition;
	exports.deserializeStorageDepositReturnUnlockCondition = deserializeStorageDepositReturnUnlockCondition;
	exports.deserializeTagFeature = deserializeTagFeature;
	exports.deserializeTaggedDataPayload = deserializeTaggedDataPayload;
	exports.deserializeTimelockUnlockCondition = deserializeTimelockUnlockCondition;
	exports.deserializeTokenScheme = deserializeTokenScheme;
	exports.deserializeTransactionEssence = deserializeTransactionEssence;
	exports.deserializeTransactionPayload = deserializeTransactionPayload;
	exports.deserializeTreasuryInput = deserializeTreasuryInput;
	exports.deserializeTreasuryOutput = deserializeTreasuryOutput;
	exports.deserializeTreasuryTransactionPayload = deserializeTreasuryTransactionPayload;
	exports.deserializeUTXOInput = deserializeUTXOInput;
	exports.deserializeUnlock = deserializeUnlock;
	exports.deserializeUnlockCondition = deserializeUnlockCondition;
	exports.deserializeUnlockConditions = deserializeUnlockConditions;
	exports.deserializeUnlocks = deserializeUnlocks;
	exports.generateBip44Address = generateBip44Address;
	exports.generateBip44Path = generateBip44Path;
	exports.getBalance = getBalance;
	exports.getUnspentAddress = getUnspentAddress;
	exports.getUnspentAddresses = getUnspentAddresses;
	exports.getUnspentAddressesWithAddressGenerator = getUnspentAddressesWithAddressGenerator;
	exports.logAddress = logAddress;
	exports.logBlock = logBlock;
	exports.logBlockMetadata = logBlockMetadata;
	exports.logFeature = logFeature;
	exports.logFeatures = logFeatures;
	exports.logFunds = logFunds;
	exports.logImmutableFeatures = logImmutableFeatures;
	exports.logInfo = logInfo;
	exports.logInput = logInput;
	exports.logMilestoneOption = logMilestoneOption;
	exports.logMilestoneOptions = logMilestoneOptions;
	exports.logMilestonePayload = logMilestonePayload;
	exports.logNativeTokens = logNativeTokens;
	exports.logOutput = logOutput;
	exports.logPayload = logPayload;
	exports.logProtocolParamsMilestoneOption = logProtocolParamsMilestoneOption;
	exports.logReceiptMilestoneOption = logReceiptMilestoneOption;
	exports.logRoutes = logRoutes;
	exports.logSignature = logSignature;
	exports.logTaggedDataPayload = logTaggedDataPayload;
	exports.logTips = logTips;
	exports.logTokenScheme = logTokenScheme;
	exports.logTransactionPayload = logTransactionPayload;
	exports.logTreasuryTransactionPayload = logTreasuryTransactionPayload;
	exports.logUnlock = logUnlock;
	exports.logUnlockCondition = logUnlockCondition;
	exports.logUnlockConditions = logUnlockConditions;
	exports.milestoneIdFromMilestonePayload = milestoneIdFromMilestonePayload;
	exports.promote = promote;
	exports.reattach = reattach;
	exports.retrieveData = retrieveData;
	exports.retry = retry;
	exports.send = send;
	exports.sendAdvanced = sendAdvanced;
	exports.sendData = sendData;
	exports.sendEd25519 = sendEd25519;
	exports.sendMultiple = sendMultiple;
	exports.sendMultipleEd25519 = sendMultipleEd25519;
	exports.sendWithAddressGenerator = sendWithAddressGenerator;
	exports.serializeAddress = serializeAddress;
	exports.serializeAddressUnlockCondition = serializeAddressUnlockCondition;
	exports.serializeAliasAddress = serializeAliasAddress;
	exports.serializeAliasOutput = serializeAliasOutput;
	exports.serializeAliasUnlock = serializeAliasUnlock;
	exports.serializeBasicOutput = serializeBasicOutput;
	exports.serializeBlock = serializeBlock;
	exports.serializeEd25519Address = serializeEd25519Address;
	exports.serializeEd25519Signature = serializeEd25519Signature;
	exports.serializeExpirationUnlockCondition = serializeExpirationUnlockCondition;
	exports.serializeFeature = serializeFeature;
	exports.serializeFeatures = serializeFeatures;
	exports.serializeFoundryOutput = serializeFoundryOutput;
	exports.serializeFunds = serializeFunds;
	exports.serializeGovernorAddressUnlockCondition = serializeGovernorAddressUnlockCondition;
	exports.serializeImmutableAliasUnlockCondition = serializeImmutableAliasUnlockCondition;
	exports.serializeInput = serializeInput;
	exports.serializeInputs = serializeInputs;
	exports.serializeIssuerFeature = serializeIssuerFeature;
	exports.serializeMetadataFeature = serializeMetadataFeature;
	exports.serializeMigratedFunds = serializeMigratedFunds;
	exports.serializeMilestoneEssence = serializeMilestoneEssence;
	exports.serializeMilestoneOption = serializeMilestoneOption;
	exports.serializeMilestoneOptions = serializeMilestoneOptions;
	exports.serializeMilestonePayload = serializeMilestonePayload;
	exports.serializeNftAddress = serializeNftAddress;
	exports.serializeNftOutput = serializeNftOutput;
	exports.serializeNftUnlock = serializeNftUnlock;
	exports.serializeOutput = serializeOutput;
	exports.serializeOutputs = serializeOutputs;
	exports.serializePayload = serializePayload;
	exports.serializeProtocolParamsMilestoneOption = serializeProtocolParamsMilestoneOption;
	exports.serializeReceiptMilestoneOption = serializeReceiptMilestoneOption;
	exports.serializeReferenceUnlock = serializeReferenceUnlock;
	exports.serializeSenderFeature = serializeSenderFeature;
	exports.serializeSignature = serializeSignature;
	exports.serializeSignatureUnlock = serializeSignatureUnlock;
	exports.serializeSimpleTokenScheme = serializeSimpleTokenScheme;
	exports.serializeStateControllerAddressUnlockCondition = serializeStateControllerAddressUnlockCondition;
	exports.serializeStorageDepositReturnUnlockCondition = serializeStorageDepositReturnUnlockCondition;
	exports.serializeTagFeature = serializeTagFeature;
	exports.serializeTaggedDataPayload = serializeTaggedDataPayload;
	exports.serializeTimelockUnlockCondition = serializeTimelockUnlockCondition;
	exports.serializeTokenScheme = serializeTokenScheme;
	exports.serializeTransactionEssence = serializeTransactionEssence;
	exports.serializeTransactionPayload = serializeTransactionPayload;
	exports.serializeTreasuryInput = serializeTreasuryInput;
	exports.serializeTreasuryOutput = serializeTreasuryOutput;
	exports.serializeTreasuryTransactionPayload = serializeTreasuryTransactionPayload;
	exports.serializeUTXOInput = serializeUTXOInput;
	exports.serializeUnlock = serializeUnlock;
	exports.serializeUnlockCondition = serializeUnlockCondition;
	exports.serializeUnlockConditions = serializeUnlockConditions;
	exports.serializeUnlocks = serializeUnlocks;
	exports.setLogger = setLogger;

	Object.defineProperty(exports, '__esModule', { value: true });
});
