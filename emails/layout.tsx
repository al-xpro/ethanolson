import { Body, Container, Head, Hr, Html, Preview, Section, Text } from "@react-email/components";
import { emailCopy } from "@/content/ui";

// The site's look, as far as e-mail allows: near-black page, white serif type
const fonts = "Georgia, 'Times New Roman', serif";
export const styles = {
  body: { backgroundColor: "#111111", color: "#ffffff", fontFamily: fonts, margin: 0, padding: "32px 0" },
  container: { maxWidth: "560px", margin: "0 auto", padding: "0 24px" },
  label: { color: "rgba(255,255,255,0.6)", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase" as const, margin: "18px 0 4px" },
  text: { color: "#ffffff", fontSize: "16px", lineHeight: "1.6", margin: 0, whiteSpace: "pre-wrap" as const },
  heading: { color: "#ffffff", fontSize: "24px", fontWeight: 400, margin: "0 0 16px" },
  muted: { color: "rgba(255,255,255,0.55)", fontSize: "12px", lineHeight: "1.6", margin: 0 },
  rule: { borderColor: "rgba(255,255,255,0.25)", margin: "28px 0 16px" },
};

export function EmailLayout({ preview, children }: { preview: string; children: React.ReactNode }) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section>{children}</Section>
          <Hr style={styles.rule} />
          <Text style={styles.muted}>{emailCopy.concept}</Text>
        </Container>
      </Body>
    </Html>
  );
}
