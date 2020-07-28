import React, { Component } from 'react';

class AndreeLawrance extends Component {

    state = {
        mounted: false
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({mounted: true});
        });
    }

    render() {
        return (
            <div className={'project-container ' + (this.state.mounted ? 'project-container-initiated' : '')}>
                <div><button onClick={this.props.onQuitProject}>QUIT</button></div>
                <div className='project-title'>ANDREE.E LAWRANCE</div>
                <p>« 沒事 is, for example, when you have urgent things to do and are scared, but then you find out that you are fine », my friend Carol once explained to me. Drinking water is important, and if it’s a way to realize that everything is fine actually, I’ll drink a lot. At least I’ll try.</p>
                <p>I’m Guillaume Meigniez, I live in Paris right now, but I also have lived in Taipei, Taiwan. And I plan to go live in Japan whenever I can.</p>
                <p>I’m a software developer at a friendly startup in Paris called Manadge where I’m in charge of the front-end of a SAAS web application. I mostly work with Angular 2+. More details about my job is available in my resume.</p>
                <p>I’m also into data visualization and its use in artistic projects. I’ve been learning web-based data visualizations libraries, and I use them whenever I can! I have been writing about dataviz, and I own a supposedly dataviz-related instagram account. I’m also a (not soooo active) member of the data visualization society, and a (mostly inactive) volunteer in the DVS Knowledge Committee.</p>
                <p>I had the chance to see one of my works being shortlisted in the  Information Is beautiful Awards in 2019, please check this out if you are interested in exploring the clubbing culture in wester Europe and its relationships with gentrification.</p>
                <p>I’m trying to code in more creative ways. Building this website was an opportunity to learn new languages. Creating 3D interfaces in the browser is a nightmare made almost enjoyable thanks to wonderful people and ressources : </p>
                <p>Soon, I want to start to code more creatively with GLSL shaders along with data visualizations. I feel that SVG are efficient and really nice, but pixels are scary cool.</p>
            </div>
        );
    }
}

export default AndreeLawrance;