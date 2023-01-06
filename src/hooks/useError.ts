import { useEffect, useState } from "react"
import { Error } from "../components/CurrencyConverter/CurrencyConverter"

export default function useError(init: Error) {
    const [showPopup, setShowPopup] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')

    useEffect(() => {
        if (init) {
            setMessage(init.message)
            setShowPopup(init.showPopup)
        }
    }, [])

    const setError = (state: Error) : void => {
        setShowPopup(state.showPopup)
        setMessage(state.message)
    }

    return [{ showPopup, message }, setError]
}