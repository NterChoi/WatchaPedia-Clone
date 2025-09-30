package kopo.sideproject.service.impl;

import kopo.sideproject.dto.FollowDTO;
import kopo.sideproject.repository.FollowRepository;
import kopo.sideproject.repository.UserInfoRepository;
import kopo.sideproject.repository.entity.FollowEntity;
import kopo.sideproject.repository.entity.UserInfoEntity;
import kopo.sideproject.service.IFollowService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class FollowService implements IFollowService {

    private final FollowRepository followRepository;
    private final UserInfoRepository userInfoRepository;

    @Override
    public void follow(String followerEmail, Long followingId) {
        // 팔로우를 하는 사람과 받는 사람의 UserInfoEntity를 조회
        UserInfoEntity follower = userInfoRepository.findByEmail(followerEmail)
                .orElseThrow(() -> new IllegalArgumentException("팔로우하는 사용자를 찾을 수 없습니다."));
        UserInfoEntity following = userInfoRepository.findById(followingId)
                .orElseThrow(() -> new IllegalArgumentException("팔로우 대상 사용자를 찾을 수 없습니다"));

        // 자기 자신을 팔로우하는 경우 방지
        if (follower.getEmail().equals(following.getEmail())) {
            throw new IllegalArgumentException("자기 자신을 팔로우할 수 없습니다.");
        }

        // 이미 팔로우 관계가 있는지 확인
        Optional<FollowEntity> existingFollow = followRepository.findByFollowerAndFollowing(follower, following);
        if (existingFollow.isPresent()) {
            // 이미 팔로우 중이면 아무것도 하지 않음
            log.info("이미 팔로우 중 입니다.");
            return;
        }

        // 새로운 팔로우 관계 생성 및 저장
        FollowEntity newFollow = FollowEntity.builder()
                .follower(follower)
                .following(following)
                .build();

        followRepository.save(newFollow);
    }

    @Override
    public void unfollow(String followerEmail, Long followingId) {
        UserInfoEntity follower = userInfoRepository.findByEmail(followerEmail)
                .orElseThrow(() -> new IllegalArgumentException("언팔로우하는 사용자를 찾을 수 없습니다."));
        UserInfoEntity following = userInfoRepository.findById(followingId)
                .orElseThrow(() -> new IllegalArgumentException("언팔로우 대상 사용자를 찾을 수 없습니다"));

        // 팔로우 관계를 조회
        FollowEntity follow = followRepository.findByFollowerAndFollowing(follower, following)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 팔로우 관계입니다."));

        // 팔로우 관계 삭제
        followRepository.delete(follow);

    }

    @Override
    @Transactional(readOnly = true)
    public FollowDTO getFollowCounts(Long userId) {
        UserInfoEntity user = userInfoRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        int followerCount = followRepository.countByFollowing(user);
        int followingCount = followRepository.countByFollower(user);

        return FollowDTO.builder()
                .followerCount(followerCount)
                .followingCount(followingCount)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<FollowDTO> getFollowerList(Long userId) {
        UserInfoEntity user = userInfoRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        // 'user'를 팔로우하고 있는 (following) 모든 관계를 찾은 뒤,
        // 그 관계에서 팔로우를 한 사용자(follower)의 정보를 추출합니다.
        return followRepository.findAllByFollowing(user).stream()
                .map(followEntity -> {
                    UserInfoEntity follower = followEntity.getFollower();
                    return FollowDTO.builder()
                            .userId(follower.getId())
                            .email(follower.getEmail())
                            .nickname(follower.getNickname())
                            .profileImg(follower.getProfileImg())
                            .build();
                })
                .collect(Collectors.toList());
    }


    @Override
    @Transactional(readOnly = true)
    public List<FollowDTO> getFollowingList(Long userId) {
        UserInfoEntity user = userInfoRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        return followRepository.findAllByFollower(user).stream()
                .map(followEntity -> {
                    UserInfoEntity following = followEntity.getFollowing();
                    return FollowDTO.builder()
                            .userId(following.getId())
                            .email(following.getEmail())
                            .nickname(following.getNickname())
                            .profileImg(following.getProfileImg())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    public boolean isFollowing(String viewerEmail, Long targetUserId) {
        // 비로그인 사용자의 경우 항상 false 반환
        if (viewerEmail == null) {
            return false;
        }

        Optional<UserInfoEntity> viewer = userInfoRepository.findByEmail(viewerEmail);
        Optional<UserInfoEntity> target = userInfoRepository.findById(targetUserId);

        // 사용자 정보가 없으면 false 반환
        if(viewer.isEmpty() || target.isEmpty()) {
            return false;
        }

        return followRepository.findByFollowerAndFollowing(viewer.get(), target.get()).isPresent();
    }
}
