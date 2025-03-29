package com.social.Social.service;

import com.social.Social.model.FriendRequest;
import com.social.Social.model.Notifys;
import com.social.Social.model.User;
import com.social.Social.responsitory.FriendRequestRepository;
import com.social.Social.responsitory.NotifyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotifyImp implements  NotifyService{
    @Autowired
    private NotifyRepository notifyRepository;
    @Autowired
    private  UserService userService;
    @Autowired
    private FriendRequestRepository friendRequestRepository;


    @Override
    public Notifys acpNotifyFriendRequest(String jwt, Long requestId) throws Exception {
        FriendRequest friendRequest = friendRequestRepository.getFriendRequestById(requestId);
        User user = userService.findUserByToken(jwt);
        Notifys notify = new Notifys();
        notify.setMessage(user.getUsername() +  " đã chấp nhận lời mời kết bạn của bạn");
        notify.setRedirect("/");
        notify.setUserId(friendRequest.getSender().getId());
       return notifyRepository.save(notify);
    }

    @Override
    public List<Notifys> getNotifyForUser(String jwt, int page) throws Exception {

        User user = userService.findUserByToken(jwt);
        Pageable pageable = PageRequest.of(page, 10);
        return  notifyRepository.getNotifyWithOffset(user.getId(),pageable);
    }

    @Override
    public void deleteNotify() {

    }
}
