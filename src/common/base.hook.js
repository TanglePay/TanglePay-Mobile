import { useEffect, useRef, useState, useCallback } from 'react';
import { useFocusEffect as useFocusEffectNative } from '@react-navigation/native';

// configure data
export const useMap = (init = {}) => {
	const [data, setMerge] = useState(init);
	const setData = useCallback((props) => {
		return setMerge((e) => {
			return { ...e, ...props };
		});
	}, []);
	return { data, setData };
};

// override useFocusEffect
export const useFocusEffect = (callback, deps = []) => {
	useFocusEffectNative(useCallback(callback, deps));
};

// use monut
export const useMount = () => {
	const isMount = useRef(true);
	useEffect(() => {
		isMount.current = true;
		return () => {
			isMount.current = false;
		};
	}, []);
	return isMount.current;
};

//fetch
//loading: 0:default, :loading，2:loaded
export const useFetch = (api, method = 'GET') => {
	const [loading, setLoading] = useState(0);
	const isMount = useMount();
	const [data, setData] = useState({});
	const request = async (params) => {
		if (loading === 1) {
			return;
		}
		setLoading(1);
		const data = await Base[method](api, params);
		if (isMount && data) {
			setData(data);
		}
		setLoading(2);
		return data;
	};
	return { loading, data, request, setData };
};

export const useFetchOnce = ({ api, method = 'GET', params = {} }) => {
	const { loading, data, setData, request } = useFetch(api, method);
	useEffect(() => {
		request(params);
	}, []);
	return { loading, data, setData, request };
};

export const useRequestOnce = (request, focus = false) => {
	const effect = focus ? useFocusEffectNative : useEffect;
	const handler = useCallback(() => {
		request();
	}, []);
	effect(handler, []);
};

export const useCountDown = (total = 60, interval = 1) => {
	const handlerRef = useRef(null);
	const [time, setTime] = useState(0);
	const stopCountDown = () => {
		handlerRef.current && clearInterval(handlerRef.current);
		handlerRef.current = null;
	};
	useEffect(() => {
		return () => {
			stopCountDown();
		};
	}, []);
	const startCountDown = () => {
		if (handlerRef.current) {
			return;
		}
		let curTime = total;
		setTime(curTime);
		stopCountDown();
		handlerRef.current = setInterval(() => {
			curTime -= 1;
			setTime(curTime);
			curTime === 0 && stopCountDown();
		}, interval * 1000);
	};
	return { time, startCountDown, stopCountDown };
};
