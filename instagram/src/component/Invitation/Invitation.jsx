import { useState } from "react";
import AccountItem from "../AccountItem/AccountItem";
import '../Suggest/suggest.scss'
function Invitation({invitation}) {
    return ( 
        <div className="suggest flex j-center">
            <div className="inner ">
                <h4 className="suggest-name">Lời mời kết bạn</h4>
                <div className="suggest-account">
                    {invitation?.map((invitation, index) => (
                        <AccountItem idRequest={invitation.id} key={index} data={invitation.sender}  feedback={true}/>
                    ))}
                </div>
            </div>
        </div>
     );
}

export default Invitation;