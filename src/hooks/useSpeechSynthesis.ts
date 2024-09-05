import React from "react";

const useSpeechSynthesis = () => {
  const [voices, setVoices] = React.useState([]);
  const [speaking, setSpeaking] = React.useState(false);
  const [supported, setSupported] = React.useState(false);
  const [activeVoice, setActiveVoice] = React.useState(0);

  const processVoices = (voiceOptions: any) => {
    setVoices(voiceOptions);
  };

  const getVoices = () => {
    let voiceOptions = window.speechSynthesis.getVoices();
    if (voiceOptions.length > 0) {
      processVoices(voiceOptions);
      return;
    }

    window.speechSynthesis.onvoiceschanged = (event: any) => {
      voiceOptions = event.target.getVoices();
      processVoices(voiceOptions);
    };
  };

  const handleEnd = () => {
    setSpeaking(false);
  };

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setSupported(true);
      getVoices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const speak = (args: any, idx: number) => {
    setActiveVoice(idx);
    const { voice = null, text = "", rate = 1, pitch = 1, volume = 1 } = args;
    if (!supported) return;
    setSpeaking(true);
    const utterance = new window.SpeechSynthesisUtterance();
    utterance.text = text;
    utterance.voice = voice;
    utterance.onend = handleEnd;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    window.speechSynthesis.speak(utterance);
  };

  const cancel = () => {
    if (!supported) return;
    setSpeaking(false);
    window.speechSynthesis.cancel();
  };

  return {
    supported,
    speak,
    speaking,
    cancel,
    voices,
    activeVoice,
    setActiveVoice,
  };
};

export default useSpeechSynthesis;
