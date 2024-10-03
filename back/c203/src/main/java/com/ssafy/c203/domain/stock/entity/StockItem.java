package com.ssafy.c203.domain.stock.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor//(access = AccessLevel.PROTECTED)
public class StockItem {
    @Id
    @Column(nullable = false, unique = true)
    private String id;


    @Column(nullable = false, unique = true)
    private String name;
}
