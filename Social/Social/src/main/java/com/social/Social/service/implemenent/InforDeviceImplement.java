package com.social.Social.service.implemenent;

import com.maxmind.geoip2.DatabaseReader;
import com.maxmind.geoip2.model.CityResponse;
import com.social.Social.service.interfaces.GetInforDevice;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.InetAddress;

@Service
public class InforDeviceImplement implements GetInforDevice {

    private static final Logger logger = LoggerFactory.getLogger(InforDeviceImplement.class);
    private DatabaseReader databaseReader;

    @PostConstruct
    public void init() {
        try {
            ClassPathResource resource = new ClassPathResource("geoip/GeoLite2-City.mmdb");
            if (!resource.exists()) {
                logger.warn("GeoIP database not found, location detection will return IP only");
                return;
            }
            // Tạo DatabaseReader một lần duy nhất khi khởi tạo service
            this.databaseReader = new DatabaseReader.Builder(resource.getInputStream()).build();
            logger.info("GeoIP database loaded successfully");
        } catch (Exception e) {
            logger.error("Failed to load GeoIP database: " + e.getMessage());
        }
    }

    @PreDestroy
    public void cleanup() {
        if (databaseReader != null) {
            try {
                databaseReader.close();
                logger.info("GeoIP database closed");
            } catch (IOException e) {
                logger.error("Error closing GeoIP database: " + e.getMessage());
            }
        }
    }

    @Override
    public String getDeviceInfo(HttpServletRequest request) {
        String userAgent = request.getHeader("User-Agent");

        if (userAgent == null) {
            return "Thiết bị không xác định";
        }

        if (userAgent.contains("Mobile") || userAgent.contains("Android")) {
            if (userAgent.contains("Android")) {
                return "Điện thoại Android";
            } else if (userAgent.contains("iPhone")) {
                return "iPhone";
            } else {
                return "Điện thoại di động";
            }
        } else if (userAgent.contains("iPad")) {
            return "iPad";
        } else if (userAgent.contains("Tablet")) {
            return "Máy tính bảng";
        } else if (userAgent.contains("Windows")) {
            return "Máy tính Windows"; // Sửa lỗi typo
        } else if (userAgent.contains("Mac")) {
            return "Máy tính Mac";
        } else if (userAgent.contains("Linux")) {
            return "Máy tính Linux";
        } else {
            return "Máy tính";
        }
    }

    @Override
    public String getLocationInfo(HttpServletRequest request) {
        String clientIp = getClientIpAddress(request);
        String location = getLocationFromIp(clientIp);
        return clientIp + (location.isEmpty() ? "" : " (" + location + ")");
    }

    @Override
    public String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }

    private String getLocationFromIp(String ip) {
        // Nếu không có database reader (file không tồn tại)
        if (databaseReader == null) {
            return "";
        }

        try {
            InetAddress ipAddress = InetAddress.getByName(ip);
            CityResponse response = databaseReader.city(ipAddress);

            String city = response.getCity().getName();
            String country = response.getCountry().getName();

            // Handle null values
            if (city != null && country != null) {
                return city + ", " + country;
            } else if (country != null) {
                return country;
            } else {
                return "";
            }

        } catch (Exception e) {
            logger.debug("Failed to get location for IP {}: {}", ip, e.getMessage());
            return "";
        }
    }
}