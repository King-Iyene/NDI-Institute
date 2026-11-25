import { Route, Switch } from "wouter";
import { AuthProvider } from "./auth-context";
import { PortalLayout, ProtectedRoute } from "./components/portal-layout";
import { LoginPage, RegisterPage } from "./pages/login";
import { DashboardPage } from "./pages/dashboard";
import { CoursesPage, CourseDetailPage } from "./pages/courses";
import { AssignmentsPage, AssignmentDetailPage } from "./pages/assignments";
import { ClassesPage, ClassDetailPage } from "./pages/classes";
import { ForumsPage, ForumDetailPage } from "./pages/forums";
import { UsersPage } from "./pages/users";

function PortalRoutes() {
  return (
    <Switch>
      <Route path="/portal/login" component={LoginPage} />
      <Route path="/portal/register" component={RegisterPage} />
      <Route path="/portal">
        <ProtectedRoute><PortalLayout><DashboardPage /></PortalLayout></ProtectedRoute>
      </Route>
      <Route path="/portal/courses">
        <ProtectedRoute><PortalLayout><CoursesPage /></PortalLayout></ProtectedRoute>
      </Route>
      <Route path="/portal/courses/:id">
        <ProtectedRoute><PortalLayout><CourseDetailPage /></PortalLayout></ProtectedRoute>
      </Route>
      <Route path="/portal/assignments">
        <ProtectedRoute><PortalLayout><AssignmentsPage /></PortalLayout></ProtectedRoute>
      </Route>
      <Route path="/portal/assignments/:id">
        <ProtectedRoute><PortalLayout><AssignmentDetailPage /></PortalLayout></ProtectedRoute>
      </Route>
      <Route path="/portal/classes">
        <ProtectedRoute><PortalLayout><ClassesPage /></PortalLayout></ProtectedRoute>
      </Route>
      <Route path="/portal/classes/:id">
        <ProtectedRoute><PortalLayout><ClassDetailPage /></PortalLayout></ProtectedRoute>
      </Route>
      <Route path="/portal/forums">
        <ProtectedRoute><PortalLayout><ForumsPage /></PortalLayout></ProtectedRoute>
      </Route>
      <Route path="/portal/forums/:id">
        <ProtectedRoute><PortalLayout><ForumDetailPage /></PortalLayout></ProtectedRoute>
      </Route>
      <Route path="/portal/users">
        <ProtectedRoute><PortalLayout><UsersPage /></PortalLayout></ProtectedRoute>
      </Route>
    </Switch>
  );
}

export function PortalApp() {
  return (
    <AuthProvider>
      <PortalRoutes />
    </AuthProvider>
  );
}
