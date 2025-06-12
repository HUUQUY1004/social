package com.social.Social.exceptions;

import com.social.Social.response.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Response> handleBadRequest(IllegalArgumentException ex) {
        Response res = new Response();
        res.setStatus(400);
        res.setMessage(ex.getMessage());
        return ResponseEntity.badRequest().body(res);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Response> handleGeneral(Exception ex) {
        Response res = new Response();
        res.setStatus(500);
        res.setMessage("Lỗi máy chủ: " + ex.getMessage());
        return ResponseEntity.status(500).body(res);
    }
}
