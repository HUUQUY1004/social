import { useEffect, useState } from "react";
import Suggest from "../../component/Suggest/Suggest";
import { getSuggestion } from "../../action/action";

function Suggestion() {
    const [suggestUser, setSuggestionUser] = useState(null);
    useEffect(()=>{
        const getSuggestions =async ()=>{
            const data = await getSuggestion()
            console.log(data);
            
            setSuggestionUser(data)
        }
        getSuggestions()
    }, [])
    return ( 
        <Suggest suggestUser={suggestUser} currentUser={[]} />
     );
}

export default Suggestion;