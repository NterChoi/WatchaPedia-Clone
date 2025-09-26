package kopo.sideproject.service;

import kopo.sideproject.dto.FollowDTO;
import kopo.sideproject.repository.entity.FollowEntity;

import java.util.List;

public interface IFollowService {

    // 팔로우 관계 생성
    void follow(String followerEmail, Long followingId);

    // 팔로우 관계 삭제
    void unfollow(String followerEmail, Long followingId);

    // 팔로워/ 팔로잉 수 조회
    FollowDTO getFollowCounts(Long userId);

    // 팔로워 목록 조회
    List<FollowDTO> getFollowerList(Long userId);

    // 팔로잉 목록 조회
    List<FollowDTO> getFollowingList(Long userId);

    // 현재 로그인한 사용자가 특정 사용자를 팔로우하고 있는지 여부 확인
    boolean isFollowing(String viewerEmail, Long targetUserId);
}
