package com.social.Social.service.interfaces;

import jakarta.servlet.http.HttpServletRequest;

public interface GetInforDevice {
    String getDeviceInfo(HttpServletRequest request);
    String getLocationInfo(HttpServletRequest request);
    String getClientIpAddress(HttpServletRequest request);
}
