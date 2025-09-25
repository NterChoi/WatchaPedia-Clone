package kopo.sideproject.repository;

import kopo.sideproject.repository.entity.FollowEntity;
import kopo.sideproject.repository.entity.UserInfoEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends CrudRepository<FollowEntity,Long> {

    // 특정 팔로워와 팔로잉 관계가 존재하는지 확인하기 위한 메서드
    Optional<FollowEntity> findByFollowerAndFollowing(UserInfoEntity follower, UserInfoEntity following);

    // 특정 사용자를 팔로우하는 사람의 수(팔로워 수)
    int countByFollowing(UserInfoEntity userInfoEntity);

    // 특정 사용자가 팔로우하는 사람의 수 ( 팔로잉 수 )
    int countByFollower(UserInfoEntity userInfoEntity);

    // 특정 사용자를 팔로우하는 모든 관계 목록 조회 (팔로워 목록)
    List<FollowEntity> findAllByFollowing(UserInfoEntity userInfoEntity);

    // 특정 사용자가 팔로우하는 모든 관계 목록 조회 (팔로잉 목록)
    List<FollowEntity> findAllByFollower(UserInfoEntity userInfoEntity);
}
