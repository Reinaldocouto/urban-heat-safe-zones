
import React, { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name
          }
        }
      });

      if (error) {
        console.error('Erro no cadastro:', error);
        let errorMessage = error.message;
        
        // Traduzir mensagens de erro comuns
        if (error.message.includes('User already registered')) {
          errorMessage = 'Este email já está cadastrado. Tente fazer login.';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Email inválido. Verifique o formato do email.';
        } else if (error.message.includes('Password should be')) {
          errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
        }
        
        toast({
          title: "Erro no cadastro",
          description: errorMessage,
          variant: "destructive",
        });
        return { error };
      }

      if (data.user) {
        toast({
          title: "Cadastro realizado!",
          description: "Conta criada com sucesso. Você já pode fazer login.",
        });
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado no cadastro:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro no login:', error);
        let errorMessage = error.message;
        
        // Traduzir e tratar mensagens de erro específicas
        if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email não confirmado. Verifique sua caixa de entrada ou tente fazer login novamente em alguns minutos.';
        } else if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos. Verifique suas credenciais.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Muitas tentativas de login. Aguarde alguns minutos antes de tentar novamente.';
        } else if (error.message.includes('User not found')) {
          errorMessage = 'Usuário não encontrado. Verifique o email ou crie uma nova conta.';
        }
        
        toast({
          title: "Erro no login",
          description: errorMessage,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Login realizado!",
        description: "Bem-vindo de volta!",
      });

      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado no login:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erro no logout:', error);
        toast({
          title: "Erro no logout",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logout realizado",
          description: "Até logo!",
        });
      }
    } catch (error) {
      console.error('Erro inesperado no logout:', error);
    }
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };
}
