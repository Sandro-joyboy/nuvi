import nodemailer from 'nodemailer'

interface SendWaitlistEmailParams {
  email: string
  position: number | string
  alreadyRegistered?: boolean
}

// Logotipo oficial da Nuvi em branco (@3x Retina PNG em memória) para renderizar inline no topo do e-mail (compatível com Gmail/Outlook/Apple Mail sem anexar arquivo .svg)
const NUVI_LOGO_WHITE_PNG_BASE64 =
  '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'

function getEmailConfig() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = Number(process.env.SMTP_PORT) || 465
  const user = process.env.SMTP_USER || 'sandro2006vieira@gmail.com'
  const pass = process.env.SMTP_PASS
  const from = process.env.SMTP_FROM || `"Nuvi" <${user}>`
  return { host, port, user, pass, from }
}

function getLogoAttachment() {
  return {
    filename: 'nuvi-logo.png',
    content: Buffer.from(NUVI_LOGO_WHITE_PNG_BASE64, 'base64'),
    contentType: 'image/png',
    contentDisposition: 'inline' as const,
    cid: 'nuvilogo',
  }
}

function wrapNuviEmailLayout(title: string, bodyHtml: string): string {
  return `
    <!DOCTYPE html>
    <html lang="pt">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F4F6F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F4F6F9; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 540px; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);">
              
              <!-- Header com Azul Nuvi e Logotipo Oficial -->
              <tr>
                <td align="center" style="background-color: #0082F6; padding: 40px 32px; text-align: center;">
                  <img src="cid:nuvilogo" alt="nuvi" width="141" height="26" style="display: block; margin: 0 auto; border: 0; outline: none; max-width: 141px; height: auto;" />
                  <p style="color: rgba(255, 255, 255, 0.9); margin: 12px 0 0 0; font-size: 14px;">O lugar onde marcas encontram creators em Angola</p>
                </td>
              </tr>

              <!-- Conteúdo -->
              <tr>
                <td style="padding: 36px 32px; color: #1F2937;">
                  ${bodyHtml}
                </td>
              </tr>

              <!-- Rodapé -->
              <tr>
                <td style="background-color: #F9FAFB; padding: 20px 32px; text-align: center; border-top: 1px solid #F3F4F6;">
                  <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                    Nuvi &copy; 2026 &bull; Luanda, Angola
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

async function dispatchNuviEmail({
  to,
  subject,
  title,
  bodyHtml,
  text,
}: {
  to: string
  subject: string
  title: string
  bodyHtml: string
  text: string
}): Promise<{ success: boolean; error?: string }> {
  const { host, port, user, pass, from } = getEmailConfig()

  if (!pass) {
    console.warn(
      '[Nodemailer] SMTP_PASS não configurada em .env.local. O email para',
      to,
      'não foi enviado fisicamente.'
    )
    return {
      success: false,
      error: 'SMTP_PASS não configurada. Configure a senha de aplicação no .env.local.',
    }
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html: wrapNuviEmailLayout(title, bodyHtml),
      text,
      attachments: [getLogoAttachment()],
    })

    console.log('[Nodemailer] Email enviado com sucesso para:', to, info.messageId)
    return { success: true }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Erro desconhecido ao enviar email'
    console.error('[Nodemailer] Falha ao enviar email para:', to, errorMessage)
    return { success: false, error: errorMessage }
  }
}

export async function sendWaitlistConfirmationEmail({
  email,
  position,
  alreadyRegistered = false,
}: SendWaitlistEmailParams): Promise<{ success: boolean; error?: string }> {
  const title = alreadyRegistered
    ? 'A sua posição na lista de espera Nuvi'
    : 'Bem-vindo à Nuvi! Fazes parte da nossa história'

  const bodyHtml = `
    <p style="font-size: 18px; line-height: 1.6; margin: 0 0 18px 0;">Olá,</p>
    
    <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; color: #4B5563;">
      ${
        alreadyRegistered
          ? 'Obrigado por verificares o teu estado! Confirmamos que já estás registado na lista de espera da Nuvi.'
          : 'Muito obrigado por te juntares à Nuvi! Estamos a preparar a plataforma que vai aproximar os criadores de conteúdo e os negócios em Angola.'
      }
    </p>

    <!-- Caixa de Destaque da Posição -->
    <div style="background-color: #EFF6FF; border: 1.5px solid #BFDBFE; border-radius: 18px; padding: 24px; text-align: center; margin: 28px 0;">
      <span style="font-size: 14px; color: #1E40AF; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">O teu lugar na fila</span>
      <span style="font-size: 38px; color: #0082F6; font-weight: 800; letter-spacing: -1px;">Nº ${position}</span>
    </div>

    <h3 style="font-size: 17px; font-weight: 600; color: #111827; margin: 28px 0 12px 0;">O que vai acontecer a seguir?</h3>
    <ul style="padding-left: 20px; margin: 0 0 28px 0; color: #4B5563; font-size: 15px; line-height: 1.6;">
      <li style="margin-bottom: 8px;">A primeira versão está prevista para <strong>1 de Janeiro</strong>.</li>
      <li style="margin-bottom: 8px;">Vais receber convites prioritários para testar e aceder antecipadamente.</li>
      <li>Novidades sobre campanhas e creators parceiros em Luanda e além.</li>
    </ul>

    <p style="font-size: 16px; line-height: 1.6; margin: 28px 0 4px 0; color: #1F2937;">Com carinho,</p>
    <p style="font-size: 18px; font-weight: 700; margin: 0; color: #0082F6;">Sandro :)</p>
  `

  return dispatchNuviEmail({
    to: email,
    subject: `Nuvi — Confirmado! És o nº ${position} da waitlist 🚀`,
    title,
    bodyHtml,
    text: `Olá!\n\nConfirmamos a tua inscrição na Nuvi.\nO teu lugar na lista é o Nº ${position}.\nA primeira versão está prevista para 1 de Janeiro.\n\nCom carinho,\nSandro :)`,
  })
}

export async function sendLaunchAnnouncementEmail({
  email,
  position,
}: {
  email: string
  position?: number | string
}): Promise<{ success: boolean; error?: string }> {
  const bodyHtml = `
    <p style="font-size: 18px; line-height: 1.6; margin: 0 0 18px 0;">Olá,</p>
    
    <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; color: #4B5563;">
      Temos uma novidade especial para partilhar contigo: <strong>já temos uma data prevista para a primeira versão da Nuvi!</strong>
    </p>

    <!-- Caixa de Destaque da Data Prevista -->
    <div style="background-color: #EFF6FF; border: 1.5px solid #BFDBFE; border-radius: 18px; padding: 26px 24px; text-align: center; margin: 28px 0;">
      <span style="font-size: 13px; color: #1E40AF; text-transform: uppercase; font-weight: 600; letter-spacing: 0.6px; display: block; margin-bottom: 8px;">Data prevista da 1ª versão</span>
      <span style="font-size: 32px; color: #0082F6; font-weight: 800; letter-spacing: -0.8px; display: block;">1 de Janeiro</span>
      ${
        position
          ? `<span style="font-size: 13.5px; color: #4B5563; display: block; margin-top: 10px;">Acesso prioritário reservado &bull; Lugar Nº ${position}</span>`
          : ''
      }
    </div>

    <p style="font-size: 16px; line-height: 1.6; margin: 0 0 18px 0; color: #4B5563;">
      Estamos a trabalhar nos últimos detalhes para que possas experimentar a plataforma em primeira mão, conectar marcas e creators com transparência e fazer parte deste início connosco.
    </p>

    <p style="font-size: 16px; line-height: 1.6; font-weight: 600; margin: 0 0 24px 0; color: #111827;">
      Esperamos por si para testar a Nuvi!
    </p>

    <p style="font-size: 16px; line-height: 1.6; margin: 28px 0 4px 0; color: #1F2937;">Com carinho,</p>
    <p style="font-size: 18px; font-weight: 700; margin: 0; color: #0082F6;">Sandro :)</p>
  `

  return dispatchNuviEmail({
    to: email,
    subject: 'Nuvi — Já temos data prevista para a primeira versão! (1 de Janeiro) 🚀',
    title: 'Já temos uma data prevista para a primeira versão da Nuvi!',
    bodyHtml,
    text: `Olá!\n\nJá temos uma data prevista para a primeira versão da Nuvi: 1 de Janeiro!\n${position ? `O teu lugar na lista continua reservado (Nº ${position}).\n` : ''}\nEsperamos por si para testar a Nuvi!\n\nCom carinho,\nSandro :)`,
  })
}
