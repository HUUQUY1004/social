import { useEffect, useState } from "react";
import Suggest from "../../component/Suggest/Suggest";
import { getInvitation, getSuggestion } from "../../action/action";
import Invitation from "../../component/Invitation/Invitation";

function Suggestion() {
    const [suggestUser, setSuggestionUser] = useState(null);
    const [invitation, setInvitation] = useState([])
    useEffect(()=>{
        const getSuggestions =async ()=>{
            const data = await getSuggestion()
            console.log(data);
            setSuggestionUser(data)
        }
        const getInvitations = async()=>{
            const data = await getInvitation()
            setInvitation(data.invitations)
            console.log("invitation", data);
            
        }
        // cos
        getSuggestions()
        getInvitations()
    }, [])
    return ( 
        <>
            {invitation.length > 0 && <Invitation invitation={invitation}/>}
            <Suggest suggestUser={suggestUser} currentUser={[]} />
        </>
     );
}

export default Suggestion;