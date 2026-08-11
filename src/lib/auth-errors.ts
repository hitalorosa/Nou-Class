/**
 * Traduz erro do Supabase Auth para uma frase que a aluna entenda.
 *
 * A distinção que importa: erro de PREENCHIMENTO (senha curta, email já
 * cadastrado) a pessoa resolve sozinha; erro de CONFIGURAÇÃO (provider
 * desligado, signup bloqueado) não é culpa dela e mandar "confira os dados"
 * só faz ela tentar de novo pra sempre. Nesse caso a mensagem diz que o
 * problema é do site e carrega o texto técnico, pra quem administra saber
 * onde mexer sem precisar abrir o console.
 */
export function mensagemDeErro(error: { message?: string }): string {
  const bruto = error.message ?? "";
  const m = bruto.toLowerCase();

  // --- a pessoa consegue resolver ---
  if (m.includes("already")) {
    return "Esse email já tem conta. Tente entrar.";
  }
  if (m.includes("invalid login credentials")) {
    return "Email ou senha incorretos. Tente de novo.";
  }
  if (m.includes("email not confirmed")) {
    return "Confirme seu email pelo link que enviamos e tente de novo.";
  }
  if (m.includes("password") && (m.includes("least") || m.includes("short"))) {
    return "A senha precisa ter pelo menos 6 caracteres.";
  }
  if (m.includes("rate limit") || m.includes("too many")) {
    return "Muitas tentativas seguidas. Espere um minutinho e tente de novo.";
  }

  // --- configuração do projeto: não adianta ela reprocessar o formulário ---
  if (
    m.includes("provider is not enabled") ||
    m.includes("signups not allowed") ||
    m.includes("disabled")
  ) {
    return `Cadastro indisponível agora — é uma configuração do site, não os seus dados. Avise a Nouê. (${bruto})`;
  }

  return `Não consegui completar agora. Tente de novo em instantes. (${bruto})`;
}
