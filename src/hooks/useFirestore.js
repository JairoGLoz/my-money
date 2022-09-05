import {useReducer, useEffect, useState} from "react";
import {projectFirestore, timestamp} from "../firebase/config";

let initialState = {
    document: null, isPending: false, error: null, // will contain error form firebase if present
    success: null
}

const firestoreReducer = (state, action) => {
    switch (action.type) {
        case 'ADDED_DOCUMENT':
            return {
                isPending: false, document: action.payload, success: true, err: null
            }
        case 'DELETED_DOCUMENT':
            return {
                isPending: false, document: null, success: true, err: null
            }
        case 'ERROR':
            return {
                isPending: false, document: null, success: false, err: action.payload
            }
        case 'IS_PENDING':
            return {
                isPending: true, document: null, success: false, err: null
            };
        default:
            return state
    }
}

export const useFirestore = (collection) => {
    // response is the response from firestore, not the response itself but one
    // object of our own that represents such response.
    const [response, dispatch] = useReducer(firestoreReducer, initialState)

    const [isCancelled, setIsCancelled] = useState(false)

    // collection ref
    const ref = projectFirestore.collection(collection)

    // only dispatch if not cancelled
    const dispatchIfNotCancelled = (action) => {
        if (!isCancelled) {
            dispatch(action)
        }
    }

    // Add a document
    const addDocument = async (doc) => {
        dispatch({type: 'IS_PENDING'})

        try {
            const createdAt = timestamp.fromDate(new Date())
            const addedDocument = await ref.add({...doc, createdAt})
            dispatchIfNotCancelled({type: 'ADDED_DOCUMENT', payload: addedDocument})
        } catch (err) {
            dispatchIfNotCancelled({type: 'ERROR', payload: err.message})
        }
    }

    // Delete a document
    const deleteDocument = async (id) => {
        dispatch({type: 'IS_PENDING'})

        try {
            await ref.doc(id).delete();
            dispatchIfNotCancelled({type: 'DELETED_DOCUMENT'})
        } catch (err) {
            dispatchIfNotCancelled({type: 'ERROR', payload: 'could not delete'})
        }
    }

    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return {addDocument, deleteDocument, response}
}