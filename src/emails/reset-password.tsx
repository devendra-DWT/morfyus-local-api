import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import * as React from 'react';

type PropsType = {
  [key: string]: string;
};

export const ResetPassword = ({
  resetLink = 'https://vercel.com/teams/invite/foo',
}: PropsType) => {
  const previewText = `Reset your password`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px] w-full bg-[#0A0A0A] text-white">
            <Section className="mt-[32px]">
              <Img
                src="https://morfyus.com/logo.png"
                width="120"
                alt="morfyus"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-[24px] text-[#ffffff] font-normal text-center p-0 my-[30px] mx-0">
              Reset Password
            </Heading>
            <Text className="text-[14px] leading-[24px] text-[#ffffff]">
              Hello,
            </Text>
            <Text className="text-[14px] leading-[24px] text-[#ffffff]">
              Go to the parcel to reset your password
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                pX={20}
                pY={12}
                className="bg-[#5BF0BA] rounded text-[#222222] text-[12px] font-bold no-underline text-center"
                href={resetLink}
              >
                Reset Password
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{' '}
              <Link href={resetLink} className="text-blue-600 no-underline">
                {resetLink}
              </Link>
            </Text>
            <Text className="text-[14px] leading-[24px] text-[#ffffff]">
              Ignore this message unless you requested a password reset
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[14px] leading-[24px] text-center my-1">
              ©2023 Morfyus
            </Text>
            <Text className="text-[#666666] text-[12px] leading-[24px] text-center">
              If you think this email is irrelevant, please ignore
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ResetPassword;
