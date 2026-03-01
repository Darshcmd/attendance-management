import React from 'react';
import styled from 'styled-components';
import { Box, Container, Typography, Grid } from '@mui/material';

const ProjectCredits = () => {
  return (
    <CreditsContainer>
      <Container maxWidth="md">
        <Grid container spacing={3}>
          {/* Project Details */}
          <Grid item xs={12} sm={6}>
            <Section>
              <SectionTitle>📚 Project Details</SectionTitle>
              <InfoText>
                <strong>Course Code:</strong> BCSE203E
              </InfoText>
              <InfoText>
                <strong>Web Programming Project</strong>
              </InfoText>
            </Section>
          </Grid>

          {/* Team Members */}
          <Grid item xs={12} sm={6}>
            <Section>
              <SectionTitle>👥 Developed By</SectionTitle>
              <TeamMember>
                <MemberName>Darsh Soni</MemberName>
                <MemberRoll>Roll No: 24BRS1207</MemberRoll>
              </TeamMember>
              <TeamMember>
                <MemberName>Ayushi Tewari</MemberName>
                <MemberRoll>Roll No: 24BRS1225</MemberRoll>
              </TeamMember>
              <TeamMember>
                <MemberName>Pritisha Mishra</MemberName>
                <MemberRoll>Roll No: 24BRS1204</MemberRoll>
              </TeamMember>
            </Section>
          </Grid>

          {/* Guidance */}
          <Grid item xs={12}>
            <Section>
              <SectionTitle>👨‍🏫 Under The Guidance Of</SectionTitle>
              <GuidanceName>Prof. Marimuthu</GuidanceName>
            </Section>
          </Grid>
        </Grid>

        <Divider />

        {/* Footer */}
        <FooterText>
          <strong>Student Attendance Management System</strong> - A Complete Solution for Educational Institutions
        </FooterText>
      </Container>
    </CreditsContainer>
  );
};

export default ProjectCredits;

// Styled Components
const CreditsContainer = styled.footer`
  background: linear-gradient(135deg, #1f1f38 0%, #2d1f4a 100%);
  color: rgba(255, 255, 255, 0.8);
  padding: 2rem 0;
  margin-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Section = styled(Box)`
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 4px solid #7f56da;
`;

const SectionTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #7f56da;
  font-size: 1.2rem;
  font-weight: 600;
`;

const InfoText = styled.p`
  margin: 0.5rem 0;
  font-size: 0.95rem;
  line-height: 1.6;
  
  strong {
    color: #fff;
  }
`;

const TeamMember = styled.div`
  margin: 1rem 0;
  padding: 0.75rem;
  background: rgba(127, 86, 218, 0.1);
  border-radius: 6px;
`;

const MemberName = styled.p`
  margin: 0;
  font-weight: 600;
  color: #fff;
  font-size: 0.95rem;
`;

const MemberRoll = styled.p`
  margin: 0.25rem 0 0 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
`;

const GuidanceName = styled.p`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #7f56da;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 2rem 0;
`;

const FooterText = styled.p`
  text-align: center;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  
  strong {
    color: #7f56da;
  }
`;
