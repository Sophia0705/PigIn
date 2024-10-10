package com.ssafy.c203.common.batch.stock.schedule;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.configuration.JobRegistry;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;

import java.text.SimpleDateFormat;
import java.util.Date;

@Configuration
@Slf4j
@RequiredArgsConstructor
public class StockSchedule {
    private final JobLauncher jobLauncher;
    private final JobRegistry jobRegistry;


    //    @Scheduled(cron = "0 */2 * * * *", zone = "Asia/Seoul")
    @Scheduled(cron = "0 37 10 * * *", zone = "Asia/Seoul")
    public void runStockJob() {
        try {
            log.info("StockSchedule schedule start");
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss");
            String date = dateFormat.format(new Date());

            JobParameters jobParameters = new JobParametersBuilder()
                    .addString("stockDate", date)
                    .addLong("stockJobId", System.nanoTime())
                    .toJobParameters();

            // 성공 여부
            JobExecution jobExecution = jobLauncher.run(jobRegistry.getJob("processStockWaitingQueueJob"), jobParameters);
            log.info("Job Execution Status: {}", jobExecution.getStatus());
        } catch (Exception e) {
            log.error("Job failed to run: ", e);
        }
    }
}




