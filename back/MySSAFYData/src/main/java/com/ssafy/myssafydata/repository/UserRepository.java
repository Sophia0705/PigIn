package com.ssafy.myssafydata.repository;

import com.ssafy.myssafydata.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, String> {
}
