export const initState = {
	value: ''
};

export const reducer = (state, action) => {
	const { type, data } = action;
	switch (type) {
		case 'value':
			return { ...state, value: data };
		default:
			return state;
	}
};
