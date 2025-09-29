package kopo.sideproject.controller;

import kopo.sideproject.dto.FollowDTO;
import kopo.sideproject.service.IFollowService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FollowController {
    private final IFollowService followService;

    // 팔로우하기
    @PostMapping("/follow/{userId}")
    public ResponseEntity<Void> follow(@PathVariable("userId") Long userId, Principal principal) {
        followService.follow(principal.getName(), userId);
        return ResponseEntity.ok().build();
    }

    // 언팔로우하기
    @DeleteMapping("/unfollow/{userId}")
    public ResponseEntity<Void> unfollow(@PathVariable("userId") Long userId, Principal principal) {
        followService.unfollow(principal.getName(), userId);
        return ResponseEntity.ok().build();
    }

    // 특정 유저의 팔로워 목록 조회
    @GetMapping("/users/{userId}/followers")
    public ResponseEntity<List<FollowDTO>> getFollowers(@PathVariable("userId") Long userId) {
        List<FollowDTO> followers = followService.getFollowerList(userId);
        return ResponseEntity.ok(followers);
    }

    // 특정 유저의 팔로잉 목록 조회
    @GetMapping("/users/{userId}/following")
    public ResponseEntity<List<FollowDTO>> getFollowing(@PathVariable("userId") Long userId) {
        List<FollowDTO> following = followService.getFollowingList(userId);
        return ResponseEntity.ok(following);
    }

    // 현재 로그인한 유저가 특정 유저를 팔로우하고 있는지 상태 조회
    @GetMapping("/users/{userId}/is-following")
    public ResponseEntity<FollowDTO> isFollowing(@PathVariable("userId") Long userId, Principal principal) {
        // principal이 null이면 비로그인 상태이므로, isFollowing은 항상 false
        boolean isFollowing = (principal != null) && followService.isFollowing(principal.getName(), userId);

        FollowDTO response = FollowDTO.builder().isFollowing(isFollowing).build();
        return ResponseEntity.ok(response);
    }

    // 특정 유저의 팔로워 / 팔로잉 수 조회
    @GetMapping("/users/{userId}/follow-counts")
    public ResponseEntity<FollowDTO> getFollowCounts(@PathVariable("userId") Long userId) {
        FollowDTO followCounts = followService.getFollowCounts(userId);
        return ResponseEntity.ok(followCounts);
    }
}
