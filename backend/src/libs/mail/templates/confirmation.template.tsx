import { Body, Heading, Link, Tailwind, Text } from '@react-email/components';
import { Html } from '@react-email/html';
import * as React from 'react';

interface ConfirmationTemplateProps {
  domain: string;
  token: string;
}

export function ConfirmationTemplate({
  domain,
  token
}: ConfirmationTemplateProps) {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  return (
    <Tailwind>
      <Html className="text-black">
        <Body>
          <Heading>Confirm your email</Heading>
          <Text>
            Hi! Please click the link below to confirm your email address.
          </Text>
          <Text>
            {' '}
            This link will expire in 1 hour. If you did not sign up, you can
            ignore this email.
          </Text>
          <Link href={confirmLink}>Confirm email</Link>
        </Body>
      </Html>
    </Tailwind>
  );
}
