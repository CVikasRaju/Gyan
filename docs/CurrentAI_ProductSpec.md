## GYAN — AI Current Affairs Digest Platform

---

## 1. Product Name & One-line Description

| Field | Detail |
|---|---|
| **Product Name** | **GYAN** *(working name)* |
| **One-line Description** | An AI-powered platform that automatically ingests, fact-checks, and delivers structured current affairs digests — ad-free, source-attributed, and bias-mitigated. |
| **Product Type** | Commercial SaaS / Web Application |
| **Version** | 1.0 (MVP) |

---

## 2. Who is the User?

**Primary User — Subscriber (End Reader)**
Someone who wants clean, reliable current affairs summaries without ads or misinformation — likely a student, professional, or researcher. They consume daily digests on the React frontend and pay a monthly subscription ($15–$30).

**Secondary User — Editorial Operator / Admin**
The internal team member who monitors flagged content inside the Headless CMS, reviews AI-quarantined articles, manages source filters, and audits cost metrics. They need full CMS access with role-based control.

Two distinct access levels: **Reader** (frontend, read-only) and **Editor/Admin** (CMS backend, full CRUD + workflow approval).

---

## 3. Core Features

| # | Feature | Priority | Description |
|---|---|---|---|
| F1 | Automated News Ingestion | Must Have | Scheduled n8n workflow pulls articles from commercial News APIs (NewsAPI.ai / NewsData.io) with NER, sentiment, and deduplication metadata pre-attached. Runs daily at 7 AM. |
| F2 | AI Transformation & Structuring | Must Have | LLM agent (routed by complexity — cheap model for bulk, flagship for nuanced) reads cleaned article data and outputs a strict JSON schema: `summary_text`, `subject_category`, `source_url`, `factual_rating`. |
| F3 | Multi-Stage QA / Fact-Check Loop | Must Have | Automated fact-checking via Originality.ai or a local Ollama model compares AI summary vs. original source. Flagged content is quarantined for human editorial review; it never auto-publishes. |
| F4 | Headless CMS Content Repository | Must Have | Strapi or Storyblok stores all validated content with version control, editorial workflows, and RBAC. Exposes a clean API consumed by the React frontend. |
| F5 | React Frontend (Reader UI) | Must Have | Fast, ad-free reading interface. Consumes CMS API. Clean UX — no auto-playing videos, no email-gating. Displays summaries with full source attribution. |
| F6 | Bias Mitigation & Source Control | Must Have | Source selection is an active editorial decision — filtered by domain, country, popularity ranking via NewsAPI.ai. Optionally cross-referenced with Ad Fontes Media ratings. |
| F7 | Webhook Security (Header Auth) | Must Have | All public n8n webhook endpoints require a secret header (`X-N8N-WEBHOOK-SECRET`). Unauthorized calls return 401 immediately — before any API credits are consumed. |
| F8 | Tiered Subscription Model | Should Have | Basic tier (Gemini Flash / DeepSeek) for high-volume routine summaries; Pro tier (Claude Opus / GPT-4) for complex geopolitical analysis. Pricing: $15–$30/month. |
| F9 | Error Alerting & Cost Monitoring | Should Have | A dedicated n8n Error Workflow triggers on pipeline failures and sends Slack/email alerts. Weekly LLM token usage reports track operational spend. |

---

## 4. Data Model

**Core content object stored in the Headless CMS:**

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Unique article record |
| `summary_text` | TEXT, NOT NULL | AI-automated structured summary |
| `subject_category` | TEXT | e.g., Politics, Economy, Science |
| `source_url` | TEXT, NOT NULL | Original article URL (mandatory for attribution) |
| `source_name` | TEXT | Publisher name |
| `original_published_at` | TIMESTAMP | Original article publication date |
| `factual_rating` | TEXT | `passed` / `flagged` / `quarantined` — output of QA loop |
| `qa_status_tag` | TEXT | Internal AI QA result tag |
| `llm_model_used` | TEXT | Which model generated this summary (for audit) |
| `created_at` | TIMESTAMP | When the record was created in the CMS |

**Entity Relationships:**
- One **NewsIngestionBatch** (daily run) → many **Articles** (raw)
- One raw Article → one **ProcessedDigest** (after transformation)
- One ProcessedDigest → one **QAResult** (pass / flag / quarantine)
- QAResult passes → **CMSEntry** (published or held for editorial review)

---

## 5. Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Workflow Engine** | n8n (self-hosted, Docker Worker mode) | 400+ integrations, LangChain AI agent support, built-in scheduling, conditional routing, error handling |
| **News Data APIs** | NewsAPI.ai / NewsData.io | Pre-analyzed NER, sentiment, deduplication — reduces LLM token load significantly |
| **LLM (Bulk)** | Google Gemini 2.5 Flash / DeepSeek V3.2 | Cost-optimized for high-volume routine summarization |
| **LLM (Premium)** | Anthropic Claude Opus 4 / OpenAI GPT-4.1 | Reserved for complex geopolitical / long-context analysis |
| **Fact-Checking** | Originality.ai API / Ollama (`bespoke-minicheck`) | Automated hallucination detection before CMS write |
| **Content Repository** | Strapi or Storyblok (Headless CMS) | RBAC, editorial workflow, version control, fast content API |
| **Database** | PostgreSQL (via Strapi) or managed Postgres | Persistent workflow state, execution logs |
| **Queue / Scaling** | Redis (with n8n Worker mode) | Parallel task processing for high-volume ingestion |
| **Frontend** | React | Lightweight, API-first presentation layer; ad-free |
| **Webhook Security** | n8n Header Authentication | Prevents unauthorized triggering and API cost drain |
| **Monitoring** | Slack / Email via n8n Error Workflow | Real-time pipeline failure alerts |

---

## 6. Constraints

### 6.1 Data Integrity
1. **Mandatory source attribution:** Every content record must include `source_url` and `original_published_at`. No content is published without these fields populated.
2. **No auto-publish on flag:** Content with `factual_rating = flagged` is never auto-published. It must be manually reviewed and approved inside the CMS editorial workflow.
3. **Clean JSON only:** LLM-generated Markdown wrappers must be stripped by a downstream Function Node before any CMS write.

### 6.2 Security
1. **Webhook protection is mandatory:** All n8n webhooks exposed to external systems must use Header Authentication. No unauthenticated public endpoints in production.
2. **Credential management:** All API keys stored in n8n's encrypted credential manager — never hardcoded in workflow nodes.

### 6.3 Cost Control
1. **LLM routing is enforced:** Routine articles must be routed to cost-optimized models only. Flagship models are invoked exclusively for complex content — enforced via conditional n8n routing logic.
2. **Budget alerting:** Weekly LLM token consumption must be audited. Unexpected cost spikes trigger an automatic Slack alert.

### 6.4 Rate Limits & Resilience
1. **Retry on fail:** All critical external API calls must have `Retry On Fail` enabled with exponential backoff.
2. **Batch throttling:** Large article batches are processed via `Loop Over Items + Wait Node` to stay within per-minute API thresholds.

### 6.5 Editorial
1. **Active source curation:** Source selection is an explicit editorial decision — not passive ingestion. The `startSourceRankPercentile` filter must be configured on all API queries.
2. **No unranked sources:** Content from unranked or low-quality sources is blocked at the ingestion stage before any LLM processing occurs.

---

## 7. Screens

| Screen | Purpose |
|---|---|
| **S1 — Home / Daily Digest Feed** | Reader-facing. Displays today's AI-generated current affairs summaries, categorized by topic (Politics, Economy, Science, etc.). Each card shows summary + source attribution + subject tag. Clean, ad-free layout. |
| **S2 — Article Detail View** | Expanded view of a single digest item. Full summary, source URL link, publication date, QA status badge, and related tags. |
| **S3 — Category / Filter View** | Filter digests by subject category, date range, or keyword search across all published content. |
| **S4 — CMS Editorial Dashboard** **(Admin only)** | Internal screen inside Strapi/Storyblok. Shows all pending content, flagged/quarantined items needing human review, published items, and version history. Editors approve or reject flagged content here. |
| **S5 — n8n Workflow Monitor** **(Admin only)** | n8n execution history view. Shows last pipeline run status, errors, retry attempts, and LLM token usage per run. Accessible only to the operations team. |
| **S6 — Subscription / Pricing Page** | Public-facing. Explains Basic vs. Pro tiers ($15–$30/month), feature comparison table, and sign-up CTA. Emphasizes "fact-checked, ad-free, source-attributed" as the core UVP against competitors. |
| **S7 — Login / Account Screen** | Email + password auth. Basic subscribers access the full digest feed. Pro subscribers see advanced analysis content. Admins/Editors are routed to the CMS dashboard. |

---