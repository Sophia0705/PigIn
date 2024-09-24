#FROM openjdk:17
#
#ARG JAR_FILE=build/libs/*.jar
#COPY ${JAR_FILE} app.jar
#
##ENV SPRING_PROFILES_ACTIVE=prod
#ENV TZ=Asia/Seoul
#
#ENTRYPOINT ["java", "-jar", "app.jar"]

FROM openjdk:17-jdk
WORKDIR /app
COPY build/libs/*.jar app.jar

ENV TZ=Asia/Seoul

ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

CMD ["/wait-for-it.sh", "postgres:5432", "--timeout=30", "--strict", "--", "java", "-jar", "app.jar"]