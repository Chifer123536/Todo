import { Body, Heading, Tailwind, Text } from '@react-email/components';
import { Html } from '@react-email/html';
import * as React from 'react';

interface TwoFactorAuthTemplateProps {
  token: string;
}

export function TwoFactorAuthTemplate({ token }: TwoFactorAuthTemplateProps) {
  return (
    <Tailwind>
      <Html>
        <Body className="text-black">
          <Heading>Two-Factor Authentication</Heading>
          <Text>
            Your two-factor authentication code is: <strong>{token}</strong>
          </Text>
          <Text>
            Please enter this code in the app to complete the authentication
            process.
          </Text>
          <Text>
            If you did not request this code, simply ignore this message.
          </Text>
        </Body>
      </Html>
    </Tailwind>
  );
}
