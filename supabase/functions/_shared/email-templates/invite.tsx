/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({ siteUrl, confirmationUrl }: InviteEmailProps) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Vous êtes invité à rejoindre Athlace</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandBar}>
          <Text style={brandText}>Athlace</Text>
        </Section>
        <Heading style={h1}>Vous êtes invité</Heading>
        <Text style={text}>
          Vous avez été invité à rejoindre{' '}
          <Link href={siteUrl} style={link}>
            <strong>Athlace</strong>
          </Link>
          , le répertoire national des clubs sportifs. Cliquez ci-dessous pour accepter l'invitation
          et créer votre compte.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Accepter l'invitation
        </Button>
        <Text style={footer}>
          Si vous n'attendiez pas cette invitation, vous pouvez ignorer cet email.
          <br />
          Une question ? Écrivez-nous à{' '}
          <Link href="mailto:contact@athlace.fr" style={link}>
            contact@athlace.fr
          </Link>
          .
        </Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

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
const button = {
  backgroundColor: '#415CAF',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  borderRadius: '12px',
  padding: '14px 24px',
  textDecoration: 'none',
  display: 'inline-block',
}
const footer = { fontSize: '12px', color: '#8b93a1', lineHeight: '1.6', margin: '32px 0 0' }
