package kopo.sideproject.service.impl;

import kopo.sideproject.dto.UserInfoDTO;
import kopo.sideproject.repository.UserInfoRepository;
import kopo.sideproject.repository.entity.UserInfoEntity;
import kopo.sideproject.service.IUserInfoService;
import kopo.sideproject.util.CmmUtil;
import kopo.sideproject.util.DateUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserInfoService implements IUserInfoService {

    private final UserInfoRepository userInfoRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserInfoDTO getEmailExists(UserInfoDTO pDTO) throws Exception {
        log.info("{}.getEmailExists() start!",this.getClass().getName());

        log.info("pDTO : {}", pDTO);

        String email = CmmUtil.nvl(pDTO.email());

        boolean exists = userInfoRepository.findByEmail(email).isPresent();

        UserInfoDTO rDTO = UserInfoDTO.builder()
                .existsYn(exists ? "Y" : "N")
                .build();

        log.info("{}.getUserIdExists End!", this.getClass().getName());
        return rDTO;
    }

    @Override
    public int signup(UserInfoDTO pDTO) throws Exception {
        log.info("{}.insertUserInfo() start!",this.getClass().getName());

        log.info("pDTO : {}", pDTO);

        // 회원가입 성공 : 1, 아이디 중복으로 인한 가입 취소 : 2, 기타 에러 발생 : 0
        int res;




        Optional<UserInfoEntity> user =  userInfoRepository.findByEmail(pDTO.email());

        if (user.isPresent()) {
            res = 2;
            log.info("Email already exists!");
        } else {

            UserInfoEntity userEntity = UserInfoEntity.builder()
                    .email(pDTO.email())
                    .password(passwordEncoder.encode(pDTO.password())) // BCrypt로 비밀번호 암호화
                    .nickname(pDTO.nickname())
                    .profileImg("/images/default_profile.png")
                    .regDt(DateUtil.getDateTime("yyyy-MM-dd hh:mm:ss"))
                    .build();

            userInfoRepository.save(userEntity);

            user = userInfoRepository.findByEmail(pDTO.email());

            if (user.isPresent()) {
                res = 1;
                log.info("User signup successfully for email: {}", pDTO.email());
            } else {
                res = 0;
                log.info("User signup failed for email: {}", pDTO.email());
            }
        }

        log.info("{}.insertUserInfo() End!", this.getClass().getName());

        return res;
    }

    @Override
    public UserInfoDTO getUserLogin(UserInfoDTO pDTO) throws Exception {
        log.info("{}.getUserLogin() start!",this.getClass().getName());

        String email = pDTO.email();
        String password = pDTO.password();

        log.info("email : {}",  email);

        Optional<UserInfoEntity> user =  userInfoRepository.findByEmail(email);

        if (user.isPresent()) {
            UserInfoEntity entity = user.get();
            String dbPassword = entity.getPassword();

            // .matches()가 입력된 비밀번호와 DB의 암호화된 비밀번호를 비교
            if (passwordEncoder.matches(password, dbPassword)) {
                log.info("Login successful for email: {}", email);
                // 성공 시, 사용자 정보를 DTO에 담아 반환
                return UserInfoDTO.builder()
                        .id(entity.getId())
                        .email(entity.getEmail())
                        .nickname(entity.getNickname())
                        .build();
            } else {
                log.warn("password mismath for email: {}", email);
            }
        } else {
            log.warn("user not found for email: {}", email);
        }

        log.info("{}.getUserLogin End!", this.getClass().getName());

        return null;
    }

    @Override
    public UserInfoDTO getUserInfo(String email) throws Exception {
        log.info("{}.getUserInfo() start!",this.getClass().getName());
        log.info("email : {}", email);

        UserInfoEntity userInfoEntity = userInfoRepository.findByEmail(email).orElse(null);

        if (userInfoEntity != null) {
            return UserInfoDTO.builder()
                    .id(userInfoEntity.getId())
                    .email(userInfoEntity.getEmail())
                    .nickname(userInfoEntity.getNickname())
                    .profileImg(userInfoEntity.getProfileImg())
                    .build();
        }

        return null;
    }

    @Override
    public UserInfoDTO getUserInfoById(Long id) throws Exception {
        log.info("{}.getUserInfoById() start!",this.getClass().getName());
        log.info("id : {}", id);

        UserInfoEntity userInfoEntity = userInfoRepository.findById(id).orElse(null);

        if (userInfoEntity != null) {
            return UserInfoDTO.builder()
                    .id(userInfoEntity.getId())
                    .email(userInfoEntity.getEmail())
                    .nickname(userInfoEntity.getNickname())
                    .profileImg(userInfoEntity.getProfileImg())
                    .build();
        }
        return null;
    }

    @Override
    @Transactional
    public void updateProfileImage(Long userId, MultipartFile profileImage) throws Exception {
        log.info("{}.updateProfileImage() start!",this.getClass().getName());
        log.info("id : {}", userId);

        // 1. 사용자 정보 조회
        UserInfoEntity userEntity = userInfoRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found! " + userId));

        // 2. 파일 유효성 검사
        if (profileImage == null || profileImage.isEmpty()) {
            throw new RuntimeException("업로드된 파일이 없습니다.");
        }

        // 3. 파일 저장 경로 및 이름 설정
        // 이미지를 저장할 디렉토리 (프로젝트 루트 기준)
        String uploadDir = "backend/src/main/static/images/profiles/";

        // 파일 확장자 추출
        String originalFilename = profileImage.getOriginalFilename();
        String fileExt = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();

        // 새로운 파일 이름 생성 (사용자ID + 현재시간)
        String newFileName = userEntity.getId() + "_" + System.currentTimeMillis() + "." + fileExt;

        // 전체 저장 경로 생성
        File saveFile = new File(uploadDir + newFileName);

        // 디렉토리가 존재하지 않으면 생성
        if (!saveFile.getParentFile().exists()) {
            saveFile.getParentFile().mkdirs();
        }

        // 4. 파일 저장
        profileImage.transferTo(saveFile);
        log.info("File saved to: {}", saveFile.getAbsolutePath());

        // 5. 데이터베이스에 저장할 웹 접근 가능 경로
        String dbPath = "/images/profiles/" + newFileName;

        // 6. 엔티티 업데이트 및 DB 저장
        // 기존 엔티티를 기반으로 새로운 엔티티를 생성 (불변성 유지)
        UserInfoEntity updateEntity = UserInfoEntity.builder()
                .id(userEntity.getId())
                .email(userEntity.getEmail())
                .password(userEntity.getPassword())
                .nickname(userEntity.getNickname())
                .profileImg(dbPath)
                .regDt(userEntity.getRegDt())
                .build();

        userInfoRepository.save(updateEntity);

        log.info("{}.updateProfileImage() End!", this.getClass().getName());
    }
}
