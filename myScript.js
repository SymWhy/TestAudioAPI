// JavaScript source code

	// Create an AudioContext
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();

    //identify each HTML element you want to use
    const audioElement = document.querySelector('audio');
    const playBtn = document.querySelector('button');
    const volSlider = document.querySelector('.volume');

    //
    const freqSlider = document.querySelector('.frequency');
    const qSlider = document.querySelector('.q-factor');
    const gainSlider = document.querySelector('.gain');
    
    const detuneSlider = document.querySelector('.detune');
    const filterSelect = document.getElementById('bqf-type');

    const audioSource = audioCtx.createMediaElementSource(audioElement);

    //if the button is clicked, pause or play
    playBtn.addEventListener('click', function() {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        //if the audio is paused, play it
        if (this.getAttribute('class') === 'paused') {
        audioElement.play();
        this.setAttribute('class', 'playing');
        this.textContent = 'Pause';
        }
        //if the audio is playing, pause it
        else if (this.getAttribute('class') === 'playing') {
            audioElement.pause();
            this.setAttribute('class', 'paused');
            this.textContent = 'Play';
        }
    });

    //reset audio to beginning
    audioElement.addEventListener('ended', function() {
        playBtn.setAttribute('class', 'paused');
        playBtn.textContent = 'Play';
    });

    //gain node (volume)
    const gainNode = audioCtx.createGain();

    const bqfNode = audioCtx.createBiquadFilter();
    bqfNode.type = 'lowpass';

    //listen for slider value change

    volSlider.addEventListener('input', function() {
        gainNode.gain.value = this.value;
    });

    //BQF Functions
    freqSlider.addEventListener('input', function() {
        bqfNode.frequency.value = this.value;
    });

    qSlider.addEventListener('input', function() {
        bqfNode.Q.value = this.value;
    });

    gainSlider.addEventListener('input', function(){
        bqfNode.gain.value = this.value;
    });

    detuneSlider.addEventListener('input', function() {
        bqfNode.detune.value = this.value;
    });


    filterSelect.addEventListener('input', function() {
        bqfNode.type = this.value;
        useQ();
        useGain();
    });

    //finally, connect it all to DESTINATION (speakers)
    audioSource.connect(bqfNode).connect(audioCtx.destination);
    audioSource.connect(gainNode).connect(audioCtx.destination);

    function useGain() {
        if (bqfNode.type == 'lowpass' || bqfNode.type == 'highpass' || 
        bqfNode.type == 'bandpass' || bqfNode.type == 'notch' || bqfNode.type == 'allpass') {
            gainSlider.disabled = true;
        }
        
        else {
            gainSlider.disabled = false;
        }
    };

    function useQ() {
        if (bqfNode.type == 'lowshelf' || bqfNode.type == 'highshelf') {
            qSlider.disabled = true;
        }
        
        else {
            qSlider.disabled = false;
        }
    };

    //visualization bit
    var r = document.querySelector(':root');
    var analyzer = audioCtx.createAnalyser();
    audioSource.connect(analyzer);

   /* function(setColor){
        r.style.setProperty(--main-bg-color, hsl(24, 100%, 80%));
    }*/