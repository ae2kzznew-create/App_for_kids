import type { PersonalRepository } from "./repository";
import type { ExternalNoteLink } from "./types";
import type { MarkdownExportInput } from "./markdownExport";

export async function loadMarkdownExportInput(repository: PersonalRepository, profileId: string, reviewLimit = 52): Promise<MarkdownExportInput> {
  const [goals, skills, quests, reviews] = await Promise.all([
    repository.listGoals(profileId),
    repository.listSkillsForProfile(profileId),
    repository.listQuests(),
    repository.listWeeklyReviews(profileId, reviewLimit),
  ]);

  const exportQuests = await Promise.all(
    quests.map(async (quest) => ({
      quest,
      skillIds: (await repository.listQuestSkills(quest.id)).map((link) => link.skillId),
    })),
  );

  const noteLinks = (await Promise.all([
    ...goals.map((goal) => repository.getExternalNoteLink("goal", goal.id)),
    ...skills.map((skill) => repository.getExternalNoteLink("skill", skill.id)),
    ...quests.map((quest) => repository.getExternalNoteLink("quest", quest.id)),
    ...reviews.map((review) => repository.getExternalNoteLink("review", review.id)),
  ])).filter((link): link is ExternalNoteLink => Boolean(link));

  return { goals, skills, quests: exportQuests, reviews, noteLinks };
}
