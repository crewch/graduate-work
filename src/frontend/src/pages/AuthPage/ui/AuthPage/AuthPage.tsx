import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui'
import { SignIn } from '../SignIn'
import { SignUp } from '../SignUp'

export const AuthPage = () => {
	return (
		<main className="h-screen flex justify-center items-center">
			<Tabs defaultValue={'sign-in'} className="w-[400px]">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="sign-in">Вход</TabsTrigger>
					<TabsTrigger value="sign-up">Регистрация</TabsTrigger>
				</TabsList>
				<TabsContent value="sign-in">
					<SignIn />
				</TabsContent>
				<TabsContent value="sign-up">
					<SignUp />
				</TabsContent>
			</Tabs>
		</main>
	)
}
