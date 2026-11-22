import { Route } from 'react-router-dom'
import { RequireSession } from './guards/RequireSession'
import { AdminLogin } from '../pages/admin-login/index'
import { QuestionBank } from '../pages/question-bank/index'
import { HeroEditor } from '../pages/hero-editor/index'
import { AdminDashboard } from '../pages/admin-dashboard/index'
import { AdminReports } from '../pages/admin-reports/index'
import { ChapterEditor } from '../pages/chapter-editor/index'
import { OrientationGuideEditor } from '../pages/orientation-guide-editor/index'
import { LearningResourcesEditor } from '../pages/learning-resources-editor/index'
import { UsersSessions } from '../pages/users-sessions/index'
import { FlashcardDecksEditor } from '../pages/flashcard-decks-editor/index'
import { DailyChallengesEditor } from '../pages/daily-challenges-editor/index'

export const adminRoutes = <>
  <Route path="/admin" element={<AdminLogin/>}/>
  <Route path="/admin/dashboard" element={<RequireSession admin><AdminDashboard/></RequireSession>}/>
  <Route path="/admin/communications" element={<RequireSession admin><AdminReports/></RequireSession>}/>
  <Route path="/admin/questions" element={<RequireSession admin><QuestionBank/></RequireSession>}/>
  <Route path="/admin/content/hero" element={<RequireSession admin><HeroEditor/></RequireSession>}/>
  <Route path="/admin/content/chapters" element={<RequireSession admin><ChapterEditor/></RequireSession>}/>
  <Route path="/admin/content/chapters/:id" element={<RequireSession admin><ChapterEditor/></RequireSession>}/>
  <Route path="/admin/content/orientation-guide" element={<RequireSession admin><OrientationGuideEditor/></RequireSession>}/>
  <Route path="/admin/content/learning-resources" element={<RequireSession admin><LearningResourcesEditor/></RequireSession>}/>
  <Route path="/admin/users" element={<RequireSession admin><UsersSessions/></RequireSession>}/>
  <Route path="/admin/content/flashcard-decks" element={<RequireSession admin><FlashcardDecksEditor/></RequireSession>}/>
  <Route path="/admin/assessments/daily" element={<RequireSession admin><DailyChallengesEditor/></RequireSession>}/>
</>
