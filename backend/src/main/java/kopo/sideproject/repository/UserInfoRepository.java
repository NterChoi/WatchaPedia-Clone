package kopo.sideproject.repository;

import kopo.sideproject.repository.entity.UserInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserInfoRepository extends JpaRepository<UserInfoEntity, Long> {

    Optional<UserInfoEntity> findByEmail(String email);

    Optional<UserInfoEntity> findByEmailAndPassword(String email,String password);

}
