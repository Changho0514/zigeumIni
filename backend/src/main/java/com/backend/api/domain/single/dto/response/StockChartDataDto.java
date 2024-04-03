package com.backend.api.domain.single.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(name = "종목별 차트 response Dto", description = "싱글게임 관련 response Dto")
public record StockChartDataDto(
    @Schema(description = "종목 Id")
    Long stockId,
    @Schema(description = "종목별 차트(350개)")
    List<StockChartDto> stockChartList
) {

}
