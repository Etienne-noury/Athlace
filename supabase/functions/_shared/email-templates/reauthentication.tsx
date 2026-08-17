/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Votre code de vérification Athlace</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandBar}>
          <Text style={brandText}>Athlace</Text>
        </Section>
        <Heading style={h1}>Votre code de vérification</Heading>
        <Text style={text}>Utilisez ce code pour confirmer votre identité :</Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={footer}>
          Ce code expire dans quelques minutes. Si vous n'êtes pas à l'origine de cette demande,
          ignorez cet email ou écrivez-nous à{' '}
          <Link href="mailto:contact@athlace.fr" style={link}>
            contact@athlace.fr
          </Link>
          .
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const brandBar = {
  backgroundColor: '#262E47',
  borderRadius: '12px',
  padding: '16px 20px',
  marginBottom: '28px',
}
const brandText = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: 'bold' as const,
  margin: '0',
  letterSpacing: '0.5px',
}
const h1 = {
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: '#262E47',
  margin: '0 0 20px',
}
const text = {
  fontSize: '15px',
  color: '#55606f',
  lineHeight: '1.6',
  margin: '0 0 20px',
}
const link = { color: '#415CAF', textDecoration: 'underline' }
const codeStyle = {
  fontFamily: 'Courier, monospace',
  fontSize: '26px',
  fontWeight: 'bold' as const,
  color: '#262E47',
  letterSpacing: '4px',
  margin: '0 0 30px',
}
const footer = { fontSize: '12px', color: '#8b93a1', lineHeight: '1.6', margin: '32px 0 0' }
