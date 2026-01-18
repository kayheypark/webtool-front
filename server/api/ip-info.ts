export default defineEventHandler(async (event) => {
  // 클라이언트 IP 주소 감지
  const headers = getHeaders(event)

  // 프록시 환경을 고려한 IP 주소 추출
  const ip =
    headers['x-forwarded-for']?.split(',')[0].trim() ||
    headers['x-real-ip'] ||
    event.node.req.socket.remoteAddress ||
    ''

  // IPv6 localhost를 IPv4로 변환
  const clientIp = ip === '::1' || ip === '::ffff:127.0.0.1' ? '127.0.0.1' : ip

  try {
    // localhost인 경우 외부 API로 실제 공인 IP 조회
    if (clientIp === '127.0.0.1' || clientIp.startsWith('192.168.') || clientIp.startsWith('10.')) {
      const ipResponse = await $fetch<{ ip: string }>('https://api.ipify.org?format=json')
      const publicIp = ipResponse.ip

      // 상세 정보 조회
      const detailResponse = await $fetch<{
        status: string
        country: string
        regionName: string
        city: string
        isp: string
      }>(`http://ip-api.com/json/${publicIp}`)

      if (detailResponse.status === 'success') {
        return {
          ip: publicIp,
          country: detailResponse.country,
          region: detailResponse.regionName,
          city: detailResponse.city,
          isp: detailResponse.isp,
        }
      }

      return {
        ip: publicIp,
      }
    }

    // 공인 IP인 경우 바로 상세 정보 조회
    const detailResponse = await $fetch<{
      status: string
      country: string
      regionName: string
      city: string
      isp: string
    }>(`http://ip-api.com/json/${clientIp}`)

    if (detailResponse.status === 'success') {
      return {
        ip: clientIp,
        country: detailResponse.country,
        region: detailResponse.regionName,
        city: detailResponse.city,
        isp: detailResponse.isp,
      }
    }

    return {
      ip: clientIp,
    }
  } catch (error) {
    console.error('IP 정보 조회 실패:', error)

    // 에러 발생 시 최소한 IP 주소만 반환
    return {
      ip: clientIp,
    }
  }
})
