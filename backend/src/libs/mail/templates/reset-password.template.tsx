import { Body, Heading, Link, Tailwind, Text } from '@react-email/components';
import { Html } from '@react-email/html';
import * as React from 'react';

interface ResetPasswordTemplateProps {
  domain: string;
  token: string;
}

export function ResetPasswordTemplate({
  domain,
  token
}: ResetPasswordTemplateProps) {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  return (
    <Tailwind>
      <Html>
        <Body className="text-black">
          <Heading>Password reset</Heading>
          <Text></Text>
          <Link href={resetLink}>Confirm password reset</Link>
          <Text>
            This link will expire in 1 hour. If you did not sign up, you can
            ignore this email.
          </Text>
        </Body>
      </Html>
    </Tailwind>
  );
}
