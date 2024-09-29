def call(String status) {
    def authorID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
    def commitMessage = sh(script: "git log -1 --pretty=%s", returnStdout: true).trim()
    def buildDetails = """
        **프로젝트**: ${env.JOB_NAME}
        **빌드 번호**: #${env.BUILD_NUMBER}
        **실행자**: ${authorID}
        **커밋**: "${commitMessage}"
        **소요 시간**: ${currentBuild.durationString}
    """

    if (status == 'success') {
        mattermostSend(
            color: 'good',
            message: ":jenkins_cute_flip:  **Build Success** :jenkins_cute_flip:\n" + buildDetails
        )
    } else if (status == 'failure') {
        def errorLog = currentBuild.rawBuild.getLog(10).join('\n')
        mattermostSend(
            color: 'danger',
            message: ":jenkins5: **Build Failed** :jenkins5:\n" + buildDetails + "\n**오류**:\n```${errorLog}```"
        )
    }
}