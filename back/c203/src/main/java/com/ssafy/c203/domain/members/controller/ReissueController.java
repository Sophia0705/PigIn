package com.ssafy.c203.domain.members.controller;

import com.ssafy.c203.common.jwt.JWTUtil;
import com.ssafy.c203.domain.members.entity.Members;
import com.ssafy.c203.domain.members.entity.WithDrawalStatus;
import com.ssafy.c203.domain.members.exceprtion.MemberNotFoundException;
import com.ssafy.c203.domain.members.repository.MembersRepository;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class ReissueController {
    private final JWTUtil jwtUtil;
    private final MembersRepository membersRepository;

    @Transactional
    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {
        //get refresh token
        String refresh = null;
        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {

            if (cookie.getName().equals("refresh")) {

                refresh = cookie.getValue();
            }
        }

        if (refresh == null) {

            //response status code
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("refresh token null");
        }

        //expired check
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {

            //response status code
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("refresh token expired");
        }

        // 토큰이 refresh인지 확인 (발급시 페이로드에 명시)
        String category = jwtUtil.getCategory(refresh);

        if (!category.equals("refresh")) {

            //response status code
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        boolean isExist = membersRepository.existsByRefreshToken(refresh);

        if (!isExist) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("invalid refresh token");
        }

        String username = jwtUtil.getUsername(refresh);
        String role = jwtUtil.getRole(refresh);
        Members member = membersRepository.findByEmailAndStatus(username, WithDrawalStatus.ACTIVE).orElseThrow(
            MemberNotFoundException::new);

        //make new JWT
        String newAccess = jwtUtil.createJwt("access", username, role, 600000L, member.getUserKey(), member.getId());
        String newRefresh = jwtUtil.createJwt("refresh", username, role, 86400000L, member.getUserKey(), member.getId());

        member.updateRefreshToken(newRefresh);
        membersRepository.save(member);

        //response
        response.setHeader("access", newAccess);
        response.addCookie(createCookie("refresh", newRefresh));

        return ResponseEntity.ok().build();
    }

    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24*60*60);
        //cookie.setSecure(true);
        //cookie.setPath("/");
        cookie.setHttpOnly(true);

        return cookie;
    }
}
