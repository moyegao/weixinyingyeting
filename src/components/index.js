// import {myHeader} from '@/comments/myHeader'

import { Header, HeaderLink, HeaderTitle, SecondHeader } from './header'
import Icon from './icons'
import Content from './content'
import { List, ListItem } from './list'
import { Button, ButtonGroup } from '../components/buttons'
import { Alert, Confirm, Prompt, Modal,Confirmtwo,Modaltwo } from '../components/modal'
import { Form, FormItem } from '../components/form'
import { Tab, TabItem } from '../components/tab'
import '../components/column'

function plugin(Vue){
	if(Plugin.installed){
		return;
	}
	// Vue.component('my-header',myHeader)
	Vue.component('page-header',Header);
	Vue.component('HeaderLink',HeaderLink);
	Vue.component('HeaderTitle',HeaderTitle);
	Vue.component('page-content',Content);
	Vue.component('Icon',Icon);
	Vue.component('ListItem',ListItem);
	Vue.component('List',List);
	Vue.component('m-button',Button);
	Vue.component('ButtonGroup',ButtonGroup);
	Vue.component('Alert',Alert);
	Vue.component('Confirm',Confirm);
	Vue.component('Confirmtwo',Confirmtwo);
	Vue.component('Modal',Modal);
	Vue.component('Modaltwo',Modaltwo);
	Vue.component('Prompt',Prompt);
	Vue.component('form-list',Form);
	Vue.component('FormItem',FormItem);
	Vue.component('Tab',Tab);
	Vue.component('TabItem',TabItem)
}



export default plugin