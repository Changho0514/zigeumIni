package com.backend.api.domain.multi.entity;

import static jakarta.persistence.GenerationType.*;
import static lombok.AccessLevel.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.backend.api.domain.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "multi_game_log")
@NoArgsConstructor(access = PROTECTED)
public class MultiGameLog extends BaseEntity {

	@Id
	@Column(name = "multi_game_log_id")
	@GeneratedValue(strategy = IDENTITY)
	private Long id;

	@OneToMany(mappedBy = "multiGameLog")
	private List<MultiTrade> multiTrade = new ArrayList<>();

	@NotNull
	private String gameLogId;

	@NotNull
	private LocalDateTime startDate;

	@OneToMany(mappedBy = "multiGameLog")
	List<MultiGamePlayer> multiGamePlayers = new ArrayList<>();

	@Builder
	public MultiGameLog(List<MultiTrade> multiTrade, String gameLogId, LocalDateTime startDate,
		List<MultiGamePlayer> multiGamePlayers) {
		this.multiTrade = multiTrade;
		this.gameLogId = gameLogId;
		this.startDate = startDate;
		this.multiGamePlayers = multiGamePlayers;
	}
}
