import React, { useRef, createContext } from 'react'
import { apiKey, baseURL } from '../../const'
import useCurrencies from '../../hooks/useCurrencies'
import useError from '../../hooks/useError'
import CurrencyUI from '../ConverterUI/CurrencyUI'
import Popup from '../Popup/Popup'
import { useDispatch } from 'react-redux'
import { setConvertedCurrency } from '../../feature/currencySlice'

export interface Error {
    message: string;
    showPopup: boolean;
}

export interface ErrorProperty {
    error: Error;
    setError: React.Dispatch<React.SetStateAction<Error>>
}

export const AppContext = createContext<ErrorProperty | null>(null)

export default function CurrencyConverter() {
    /** User defined hook to get list of currencies */
    const currencies = useCurrencies()
    /** ref to handle select the currency unit to convert from */
    const from = useRef<HTMLInputElement>(null!)
    /** ref to handle select the currency unit to convert to */
    const to = useRef<HTMLInputElement>(null!)
    /** ref to handle input amount to convert */
    const fromValue = useRef<HTMLInputElement>(null!)
    /** User defined hook to display error */
    const [error, setError] = useError({showPopup: false, message: ''})
    const dispatch = useDispatch()

    /**
     * Business logic to convert the currency from one unit to another
     */
    const convert = () => {
        let myHeaders = new Headers();
        myHeaders.append('apikey', apiKey);
        let requestOptions: RequestInit = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders
        };
        fetch(baseURL + 'convert?to=' + to.current.value + '&from=' + from.current.value + '&amount=' + fromValue.current.value, requestOptions)
            .then(response => response.text())
            .catch(err => {
                setError({
                    showPopup: true,
                    message: 'Service not available\nPlease try again later'
                })
            })
            .then(res => {
                if(typeof(res) === 'string') {
                    if (!JSON.parse(res).result) {
                        setError({
                            message: 'Service not available\nPlease try again later',
                            showPopup: true
                        })
                    }
                    dispatch(setConvertedCurrency(JSON.parse(res).result))
                }
            }).catch(err => {
                setError({
                    showPopup: true,
                    message: 'Service not available\nPlease try again later'
                })
            })
    }

    /**
     * Loading UI for corrency convertion
     */
    return (
        <>
            <AppContext.Provider value={{ error, setError }}>
                <Popup />
            </AppContext.Provider>
            <CurrencyUI fromRef={from} toRef={to} fromValueRef={fromValue} onClick={convert} currencies={currencies} />
        </>
    )
}