import {useEffect, useRef} from "react";
import {useState} from "react";
import {projectFirestore} from "../firebase/config";

export const useCollection = (collection, _query, _orderBy) => {
    const [documents, setDocuments] = useState(null);
    const [error, setError] = useState(null)

    // We do this so we can get the actual value under the _query parameter
    // (which is an array and so it is a reference) so the useEffect hook
    // doesn't think it's changing every time just because it's reference
    // changes.
    //
    // If we don't use a ref ---> infinite loop in useEffect
    // _query is an array and is "different" on every function call
    const query = useRef(_query).current;
    const orderBy = useRef(_orderBy).current;

    useEffect(() => {
        let ref = projectFirestore.collection(collection);

        if (query) {
            ref = ref.where(...query)
        }

        if (orderBy) {
            ref = ref.orderBy(...orderBy)
        }

        // Get a snapshot once initially, when we connect to the collection and then again
        // every time the collection changes.
        const unsubscribe = ref.onSnapshot((snapshot) => {
            let results = []
            snapshot.docs.forEach((doc) => {
                results.push({...doc.data(), id: doc.id})
            })

            // update state
            setDocuments(results)
            setError(null)
        }, (error) => {
            console.log(error)
            setError('could not fetch data')
        })

        // unsubscribe on unmount
        return () => unsubscribe();

    }, [collection, query, orderBy])

    return {documents, error}
}