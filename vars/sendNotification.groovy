def call(String status) {
    def authorID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
    def commitMessage = sh(script: "git log -1 --pretty=%s", returnStdout: true).trim()
    def buildStage = env.STAGE_NAME ?: "N/A"
    def buildDetails = """
    📌 __프로젝트__: `${env.JOB_NAME}`
    🔢 __빌드 번호__: `#${env.BUILD_NUMBER}`
    👤 __실행자__: `${authorID}`
    📝 __커밋 메시지__: "${commitMessage}"
    📶 __빌드 스테이지__: `${buildStage}`
    ⏱ __소요 시간__: `${currentBuild.durationString}`
    """

    if (status == 'success') {
        mattermostSend(
            color: 'good',
            message: "🎉 __Build Success__ 🎉\n${buildDetails}"
        )
    } else if (status == 'failure') {
        def errorLog = currentBuild.rawBuild.getLog(50).join('\n')
        mattermostSend(
            color: 'danger',
            message: "❌ __Build Failed__ ❌\n${buildDetails}\n\n🔴 __오류 스테이지__: `${buildStage}`\n\n🔴 __오류 로그__:\n```${errorLog}```"
        )
    }
}
